import { MongoClient, ServerApiVersion } from 'mongodb'

export const mongo = new MongoClient(process.env.MONGO_CONNECTION_STRING!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  retryWrites: true,
  retryReads: true,
  readConcern: {
    level: 'majority',
  },
  readPreference: 'secondaryPreferred',
})

export const database = mongo.db(process.env.DATABASE)
