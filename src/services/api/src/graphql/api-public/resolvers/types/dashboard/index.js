const _import = p => import(p).then(({ default: fn }) => fn)

export default {
  id: async self => self._id,
  addChart: await _import('./_add-chart.js'),
  removeChart: await _import('./_remove-chart.js'),
  addFilter: await _import('./_add-filter.js'),
  removeFilter: await _import('./_remove-filter.js'),
  charts: await _import('./_charts.js'),
  filters: await _import('./_filters.js'),
}
