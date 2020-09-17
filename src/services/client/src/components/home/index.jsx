import React, { useContext } from 'react'
import { Grid, useMediaQuery, Typography, Fade, Divider } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import { gql, useQuery } from '@apollo/client'
import { RecordsSearch, Loading } from '../../components'
import { GlobalContext } from '../../modules/provider-global'
import useStyles from './style'
import clsx from 'clsx'
import { isMobile } from 'react-device-detect'
import { CLIENT_HOST_ADDRESS } from '../../config'

const CARD_BG_COLOUR = 'rgba(255,255,255,0.75)'

export default () => {
  const classes = useStyles()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('md'))
  const { global } = useContext(GlobalContext)

  const { error, loading, data } = useQuery(
    gql`
      query catalogue($match: String!) {
        catalogue {
          records(match: $match) {
            totalCount
          }
        }
      }
    `,
    {
      variables: { match: global.text || '' },
    }
  )

  return (
    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
      {loading ? <Loading /> : undefined}

      <Grid
        container
        style={{ position: 'absolute', top: 'calc(50% - 120px)', zIndex: 1 }}
        alignItems="stretch"
        item
        className={clsx({
          [classes.mobile]: !matches,
          [classes.notMobile]: matches,
        })}
        xs={12}
        md={6}
      >
        <Grid
          container
          direction={isMobile ? 'column' : 'row'}
          item
          xs={12}
          style={{
            backgroundColor: CARD_BG_COLOUR,
            padding: 16,
          }}
        >
          <Grid style={{ display: 'flex' }} item>
            <a style={{ display: 'block', margin: 'auto' }} href={CLIENT_HOST_ADDRESS}>
              <img
                style={{
                  height: 56,
                }}
                src="/saeon-logo.png"
              />
            </a>
          </Grid>
          <Grid style={{ display: 'flex' }} item>
            {isMobile ? (
              <div style={{ margin: 4 }} />
            ) : (
              <Divider variant="middle" orientation={'vertical'} />
            )}
          </Grid>
          <Grid item style={{ flexGrow: 2 }}>
            <RecordsSearch resetGlobalStateOnSearch={true} autofocus={true}>
              <Typography variant="overline">
                {error ? (
                  error.message
                ) : loading ? (
                  <Fade key="waiting" in={loading}>
                    <span>...</span>
                  </Fade>
                ) : (
                  <Fade key="results" in={!loading}>
                    <span>{data?.catalogue.records.totalCount} records</span>
                  </Fade>
                )}
              </Typography>
            </RecordsSearch>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}