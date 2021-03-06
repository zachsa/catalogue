import { execute } from 'graphql'
import mongo from 'mongodb'
import { ODP_ADDRESS_CATALOGUE_ENDPOINT } from '../../config.js'
import authenticateWithOdp from '../../lib/authenticate-with-odp.js'
import fetch from 'node-fetch'
import { gql } from 'apollo-server-koa'

/**
 * TODO
 *
 * This will fail when there are more than 10 000
 * Elasticsearch results. To fix, make multiple
 * trips to Elasticsearch to append to the client
 * stream.
 *
 * This shouldn't be that complicated since the
 * catalogue records endpoint already supports
 * pagination
 */

const { ObjectID } = mongo

export default async ctx => {
  const { findLists } = ctx.mongo.dataFinders
  const { search } = ctx.query
  const { publicSchema } = ctx.gql

  if (!search) {
    ctx.throw(400, 'No search ID provided. Unable to download records')
  }

  // Set appropriate response headers
  ctx.set('Content-disposition', `attachment; filename=odp-${new Date().toISOString()}.json`)
  ctx.set('Content-Type', 'application/force-download')

  // Load the saved search state
  const { search: searchState } = (await findLists({ _id: ObjectID(search) }))[0]

  // Query the catalogue for the IDs associated with this search state
  const { data } = await execute(
    publicSchema,
    gql`
      query(
        $ids: [ID!]
        $dois: [String!]
        $text: String
        $terms: [TermInput!]
        $extent: WKT_4326
        $size: Int
      ) {
        catalogue {
          records(
            ids: $ids
            dois: $dois
            text: $text
            terms: $terms
            extent: $extent
            size: $size
          ) {
            nodes {
              id
            }
          }
        }
      }
    `,
    null,
    ctx,
    Object.assign({ size: 10000 }, searchState)
  )

  // Authenticate with the ODP
  const { token_type, access_token } = await authenticateWithOdp()

  // Stream the ODP response to the client
  ctx.body = await fetch(`${ODP_ADDRESS_CATALOGUE_ENDPOINT}/?limit=10000`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: [token_type, access_token].join(' '),
    },
    body: JSON.stringify(data.catalogue.records.nodes.map(({ id }) => id)),
  }).then(res => res.body)
}
