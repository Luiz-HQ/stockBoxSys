import type { FastifyInstance } from 'fastify'
import { registerController } from './auth.controller'

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', registerController)
}