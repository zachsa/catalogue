import { db as mongoDb, collections, getDataFinders, Logger } from '../mongo/index.js'
import postgisQuery, { createClient } from '../postgis/query.js'
import Catalogue from '../lib/catalogue.js'
import {
  CATALOGUE_API_PROXY_ADDRESS,
  CATALOGUE_API_ELASTICSEARCH_INDEX_NAME,
  CATALOGUE_API_KEY,
} from '../config.js'
import { publicSchema, internalSchema } from '../graphql/index.js'
import userModel from '../user-model/index.js'
import { encrypt, decrypt } from '../lib/crypto.js'

const catalogue = new Catalogue({
  dslAddress: `${CATALOGUE_API_PROXY_ADDRESS}/elasticsearch`,
  index: CATALOGUE_API_ELASTICSEARCH_INDEX_NAME,
})

const logToMongo = new Logger() // Application-level batching

export default app => async (ctx, next) => {
  app.context.userInfo = ctx.state.user

  app.context.catalogue = catalogue

  app.context.mongo = {
    db: mongoDb,
    collections,
    dataFinders: getDataFinders(), // Request level batching
    logToMongo: logToMongo.load.bind(logToMongo),
  }

  app.context.postgis = {
    query: postgisQuery,
    createClient,
  }

  app.context.gql = {
    publicSchema,
    internalSchema,
  }

  app.context.user = userModel

  app.context.crypto = {
    encrypt: plainTxt =>
      encrypt(plainTxt, Buffer.from(CATALOGUE_API_KEY, 'base64')).toString('base64'),
    decrypt: encryptedTxt =>
      decrypt(
        Buffer.from(encryptedTxt, 'base64'),
        Buffer.from(CATALOGUE_API_KEY, 'base64')
      ).toString('utf8'),
  }

  await next()
}
