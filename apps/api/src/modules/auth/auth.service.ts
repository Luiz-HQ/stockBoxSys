import { prisma } from "../../plugins/prisma";
import { supabaseAdmin } from "../../plugins/supabase";
import { generateUniqueSlug } from "../../shared/slug";
import type { RegisterInput } from "./auth.schema";

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
