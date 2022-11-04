import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { poolRoutes } from './routes/pool'
import { userRoutes } from './routes/user'
import { guessRoutes } from './routes/guess'
import { authRoutes } from './routes/auth'
import { gameRoutes } from './routes/game'

async function bootstrap() {
  const fastify = Fastify({
    logger: true
  })

  await fastify.register(cors, {
    origin: true, // Qualquer aplicação poderá acessar o back-end (em prod alterar para o domínio da aplicação)
  })

  await fastify.register(jwt, {
    secret: 'nllwcopa', // Em produção precisa ser uma variável ambiente
  })

  await fastify.register(poolRoutes)
  await fastify.register(authRoutes)
  await fastify.register(gameRoutes)
  await fastify.register(guessRoutes)
  await fastify.register(userRoutes)

  await fastify.listen({port: 3333, host: '0.0.0.0'})
}

bootstrap()