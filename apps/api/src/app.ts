import Fastify from "fastify";
import "dotenv/config";
import { prisma } from "./plugins/prisma";
import { authRoutes } from "./modules/auth/auth.routes";
import { authenticate } from "./middlewares/auth";
const app = Fastify({
  logger: true, // show on terminal all logs and errors
});

app.get("/", async () => {
  return { status: "ok", message: "Servidor rodando!" };
});

app.get("/test-db", async () => {
  const tenants = await prisma.tenant.findMany();
  return { tenants };
});

app.register(authRoutes);

app.get('/me', { preHandler: authenticate }, async (request) => {
  return { currentUser: request.currentUser }
})

const start = async () => {
  try {
    await app.listen({ port: 3333 });
    console.log("Servidor rodando na porta 3333");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
