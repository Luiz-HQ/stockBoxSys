import Fastify from "fastify";
import 'dotenv/config'
import { prisma } from "./plugins/prisma";
import { authRoutes } from "./modules/auth/auth.routes";
const app = Fastify({
  logger: true, // mostra no terminal o que está acontecendo, ajuda a entender erros
});

// Uma rota simples só pra testar se está tudo funcionando
app.get("/", async () => {
  return { status: "ok", message: "Servidor rodando!" };
});

app.get("/test-db", async () => {
  const tenants = await prisma.tenant.findMany();
  return { tenants };
});

app.register(authRoutes) // <-- adiciona aqui

// Aqui o servidor começa a "escutar" pedidos numa porta
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
