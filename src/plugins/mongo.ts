//@ts-nocheck
import * as Fastify from 'fastify'
import { MongoClient } from "mongodb"
import * as fp from "fastify-plugin"

export interface FastifyMongoOptions {
    dbname: string
}

const fastifyMongoClient = async (fastify: Fastify.FastifyInstance, options: FastifyMongoOptions) => {
    const opts = {
        useUnifiedTopology: true
    }
    const { dbname } = options
    const url = `${process.env.MONGODBURL}/${dbname}`

    const mongodbClient: MongoClient = new MongoClient(url, opts)


    try {
        await mongodbClient.connect()

        fastify.addHook("onClose", () => {
            console.log("Connection to MongoDB closed!")
        })

        if (!fastify.mongo) {
            fastify.decorateRequest('mongo', mongodbClient)
            console.log("Decorated with MongoDB client!")
        }
    }
    catch (e) {
        console.log("MongoDb server is offline!")
    }


}

export default fp(fastifyMongoClient)

