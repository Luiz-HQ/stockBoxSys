import type { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../plugins/prisma";
import { supabaseAdmin } from "../plugins/supabase";

// This middleware checks if the request has a valid token.
// If yes, it attaches the current user (with tenant info) to the request.
// If not, it blocks the request with a 401 error.
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply
      .status(401)
      .send({ error: "Missing or invalid authorization header" });
  }

  const token = authHeader.replace("Bearer ", "");

  // Ask Supabase if this token is valid, and who it belongs to
  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) {
    return reply.status(401).send({ error: "Invalid or expired token" });
  }

  // Find the matching local user record
  const user = await prisma.user.findUnique({
    where: { authUserId: data.user.id },
    include: { tenant: true },
  });

  if (!user || !user.active) {
    return reply.status(401).send({ error: "User not found or inactive" });
  }

  // Attach the user to the request, so any route after this middleware
  // can access "request.currentUser"
  request.currentUser = {
    id: user.id,
    tenantId: user.tenantId,
    tenantName: user.tenant.name,
    role: user.role,
    name: user.name,
    email: user.email,
  };
}
