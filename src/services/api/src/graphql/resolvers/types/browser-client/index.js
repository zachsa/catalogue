const _import = p => import(p).then(({ default: fn }) => fn)

export default {
  persistSearchState: await _import('./_persist-search-state.js'),
}
