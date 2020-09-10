import mongodb from 'mongodb'
const { ObjectID } = mongodb
import hash from 'object-hash'

export default async (self, args, ctx) => {
  const { state } = args
  const { SavedSearches } = await ctx.mongo.collections

  const result = await SavedSearches.findOneAndUpdate(
    {
      hashedState: hash(state),
    },
    {
      $setOnInsert: {
        id: ObjectID(),
        hashedState: hash(state),
        state,
        createdAt: new Date(),
      },
      $set: {
        modifiedAt: new Date(),
      },
    },
    {
      upsert: true,
      returnNewDocument: true,
    }
  )

  return (result.value?._id || result.lastErrorObject?.upserted).toString()
}
