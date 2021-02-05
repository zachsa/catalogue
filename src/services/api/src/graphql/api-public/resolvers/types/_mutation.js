const _import = p => import(p).then(({ default: fn }) => fn)

export default {
  logBrowserEvents: await _import('../mutations/log-browser-events.js'),
  createDatabook: await _import('../mutations/create-databook/index.js'),
  createAtlas: await _import('../mutations/create-atlas.js'),
  persistSearchState: await _import('../mutations/persist-search-state.js'),
  createDashboard: await _import('../mutations/create-dashboard.js'),
  updateDashboard: await _import('../mutations/update-dashboard.js'),
  deleteDashboard: await _import('../mutations/delete-dashboard.js'),
  addChartToDashboard: await _import('../mutations/add-chart-to-dashboard.js'),
  removeChartFromDashboard: await _import('../mutations/remove-chart-from-dashboard.js'),
  addFilterToDashboard: await _import('../mutations/add-filter-to-dashboard.js'),
  removeFilterFromDashboard: await _import('../mutations/remove-filter-from-dashboard.js'),
  createChart: await _import('../mutations/create-chart.js'),
  deleteChart: await _import('../mutations/delete-chart.js'),
  createFilter: await _import('../mutations/create-filter.js'),
  deleteFilter: await _import('../mutations/delete-filter.js'),
}
