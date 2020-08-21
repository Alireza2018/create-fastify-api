//@ts-nocheck
import * as Fastify from 'fastify'
import * as fastifyJwt from 'fastify-jwt'
import * as fastifyCors from 'fastify-cors'
import mongoClient from './plugins/mongo'
import fastifyJwt from './plugins/auth'


export default function createServer(opts?: Fastify.ServerOptions) {
  const fastify = Fastify(opts)

  fastify.register(mongoClient, {
    dbname: "YOUR_DB_NAME"
  })

  fastify.register(fastifyCors, {
    origin: ["http://localhost:3001", "http://localhost:3000"],
    methods: ["GET", "POST"]
  })

  /*AUH0 INTEGRATION
    YOU WILL NEED:
    1.AUTH0_DOMAIN
    2.API_AUDIENCE

    UNCOMMENT WHEN YOU HAVE SET UP THE AUTH0 FOR YOUR PROJECT

    fastify.register(fastifyJwt, {
      secret: jwtSecretMiddleware({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'YOUR_AUTH0_DOMAIN/.well-known/jwks.json'
      }),
      audience: 'YOUR_API_AUDIENCE',
      issuer: 'YOUR_AUTH0_DOMAIN',
      algorithms: ['RS256'],
      decode: { complete: true },
    });
  */

  //DECORATE FSTIFY TO CHECK FOR A VALID AUTHORIZATION TOKEN IN A REQUEST
  //YOU WILL NEED TO:
  //1.ENABLE THE FASTIFYJWT PLUGIN(ABOVE LINES)
  //2.PROTECT A ROUTE IN THE PREVALIDATION STEP => http_method('/route_name', {preValidation: [fastify.authorize]}, (req,res)= > {})
  fastify.decorate("authorize", async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.code(401).send({ "error": err.message });
    }
  })

  fastify.get('/', async (request: Fastify.FastifyRequest, reply: Fastify.FastifyReply) => {
    return reply.send({ hello: 'world!!!' })
  })

  return fastify
}
