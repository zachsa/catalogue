import fetch from 'node-fetch'
import catalogue from '@saeon/catalogue-search/dist/catalogue.js'
import { HTTP_PROXY } from '../../../config.js'

const { Catalogue } = catalogue

// TODO this should be a single instance for the lifecycle of the node.js app
const DSL_INDEX = `saeon-odp-4-2`
const DSL_PROXY = `${HTTP_PROXY}/proxy/saeon-elk`
const catalog = new Catalogue({
  dslAddress: DSL_PROXY,
  index: DSL_INDEX,
  httpClient: fetch,
})

// eslint-disable-next-line no-unused-vars
export default async (self, args, ctx) => {
  const { fields, subjects } = args
  const result = await catalog.countPivotOn({ fields, subjects })
  return result
}