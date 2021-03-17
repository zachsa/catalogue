import { CATALOGUE_CLIENT_ADDRESS } from '../../config'
import { setShareLink } from '../../hooks/use-share-link'
import getUriState from '../../lib/fns/get-uri-state'
import Loading from '../../components/loading'
import DashboardContextProvider from './context'
import { gql, useQuery } from '@apollo/client'
import AppBar from '@material-ui/core/AppBar'
import Grid from '@material-ui/core/Grid'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Layout from './layout'
import useStyles from './style'
import clsx from 'clsx'
import FiltersDrawer from './drawer/index'

const POLLING_INTERVAL = 500

export default ({ id }) => {
  const classes = useStyles()
  const { poll } = getUriState()
  setShareLink({
    uri: `${CATALOGUE_CLIENT_ADDRESS}/render/dashboard?id=${id}`,
    params: false,
  })

  const { error, loading, data, startPolling } = useQuery(
    gql`
      query($id: ID!) {
        dashboard(id: $id) {
          id
          title
          subtitle
          description
          layout
          filters {
            id
          }
        }
      }
    `,
    {
      variables: { id },
    }
  )

  if (loading) {
    return <Loading />
  }

  if (error) {
    throw error
  }

  if (poll) {
    startPolling(POLLING_INTERVAL)
  }

  const { layout, filters, title, subtitle, description } = data.dashboard
  const filterIds = filters.map(({ id }) => id)

  return (
    <>
      <Grid container justify="center">
        <DashboardContextProvider filterIds={filterIds || []}>
          <Grid item xs={12}>
            <div style={{ flexGrow: 1 }}>
              <AppBar
                style={window.location.pathname.includes('/render') ? {} : { marginTop: 48 }}
                variant="elevation"
              >
                <Toolbar variant="dense" style={{ overflowX: 'auto', display: 'block' }}>
                  <FiltersDrawer filterIds={filterIds} />
                </Toolbar>
              </AppBar>
            </div>
          </Grid>
          <Grid item xs={12} style={{ margin: '36px 0' }} />
          <div style={{ height: '400px', width: '1px' }}></div>
          <Grid justify="space-evenly" container item xs={12} sm={10} md={8}>
            <Grid item xs={12}>
              <div className={clsx(classes.layout)}>
                <Typography variant="h2" className={clsx(classes.title)}>
                  {title || 'Untitled'}
                </Typography>
                <Typography className={clsx(classes.subtitle)} variant="overline">
                  {subtitle || 'No subtitle'}
                </Typography>
                <Typography className={clsx(classes.description)} variant="body2">
                  {description || 'No description'}
                </Typography>
              </div>
            </Grid>
            <div style={{ position: 'relative', width: '100%' }}>
              <Layout items={layout} />
            </div>
          </Grid>
        </DashboardContextProvider>
      </Grid>
    </>
  )
}
