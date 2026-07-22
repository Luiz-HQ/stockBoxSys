import { prisma } from "../../plugins/prisma";
import { supabaseAdmin } from "../../plugins/supabase";
import { generateUniqueSlug } from "../../shared/slug";
import type { LoginInput, RegisterInput } from "./auth.schema";

export async function registerStore(input: RegisterInput) {
  // 1. Create user on Supabase (Auth)
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? "Erro ao criar usuário");
  }

  try {
    // 2. Create tenant and user on Prisma (PostgreSQL)
    const tenant = await prisma.tenant.create({
      data: {
        name: input.storeName,
        slug: generateUniqueSlug(input.storeName),
        users: {
          create: {
            authUserId: data.user.id,
            name: input.userName,
            email: input.email,
            role: "ADMIN",
          },
        },
      },
      include: { users: true },
    });

    return tenant;
  } catch (dbError) {
    // If there's an error creating the tenant in the database, delete the user from Supabase.
    await supabaseAdmin.auth.admin.deleteUser(data.user.id);
    throw dbError;
  }
}

export async function loginUser(input: LoginInput) {
  // 1. Ask Supabase to check the email and password
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  })

  if (error || !data.session) {
    throw new Error('Invalid email or password')
  }

  // 2. Find the matching local user record (with tenant info)
  const user = await prisma.user.findUnique({
    where: { authUserId: data.user.id },
    include: { tenant: true },
  })

  if (!user || !user.active) {
    throw new Error('User not found or inactive')
  }

  // 3. Return the token plus useful user/tenant info for the frontend
  return {
    accessToken: data.session.access_token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      tenantName: user.tenant.name,
    },
  }
}