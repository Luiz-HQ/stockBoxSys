import type { FastifyRequest, FastifyReply } from "fastify";
import { loginSchema, registerSchema } from "./auth.schema";
import { loginUser, registerStore } from "./auth.service";

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const input = registerSchema.parse(request.body);
  const tenant = await registerStore(input);
  return reply.status(201).send({ tenant });
}

export async function loginController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const input = loginSchema.parse(request.body);
  const result = await loginUser(input);
  return reply.status(200).send(result);
}
