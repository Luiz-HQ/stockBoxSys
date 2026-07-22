import 'fastify'

// Extends Fastify's request type to include the authenticated user
declare module 'fastify' {
  interface FastifyRequest {
    currentUser?: {
      id: string
      tenantId: string
      tenantName: string
      role: string
      name: string
      email: string
    }
  }
}