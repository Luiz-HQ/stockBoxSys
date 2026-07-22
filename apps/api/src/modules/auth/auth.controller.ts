import type { FastifyRequest, FastifyReply } from 'fastify'
import { registerSchema } from './auth.schema'
import { registerStore } from './auth.service'

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const input = registerSchema.parse(request.body)
  const tenant = await registerStore(input)
  return reply.status(201).send({ tenant })
}