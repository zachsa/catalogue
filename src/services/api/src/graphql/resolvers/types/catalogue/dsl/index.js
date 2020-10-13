import multiMatch from './_multi-match.js'
import geoShape from './_geo-shape.js'
import termsQuery from './_terms.js'
import doisQuery from './_dois.js'
import idsQuery from './_ids.js'
import min_score from './_min-score.js'

export default ({ dsl, ids, dois, match, terms, extent, isAggregation = false }) => {
  if (isAggregation) {
    if (extent || terms?.length || match || ids?.length || dois?.length) {
      dsl.query = {
        bool: {
          must: [],
        },
      }
    }
  }

  if (terms?.length || match) {
    dsl.min_score = min_score
  }

  if (ids && ids.length) {
    if (!isAggregation) dsl.size = ids.length
    dsl.query.bool.must = [idsQuery(ids)]
  } else if (dois && dois.length) {
    if (!isAggregation) dsl.size = dois.length
    dsl.query.bool.must = [doisQuery(dois)]
  } else {
    if (match) {
      dsl.query.bool.must = [...dsl.query.bool.must, multiMatch(match.toLowerCase())]
    }
    if (terms?.length) {
      dsl.query.bool.must = [...dsl.query.bool.must, ...termsQuery(terms)]
    }
    if (extent) {
      dsl.query.bool.must = [...dsl.query.bool.must, geoShape(extent)]
    }
  }

  return dsl
}
