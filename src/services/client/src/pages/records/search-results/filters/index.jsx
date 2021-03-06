import Grid from '@material-ui/core/Grid'
import Fade from '@material-ui/core/Fade'
import useTheme from '@material-ui/core/styles/useTheme'
import TagFilter from './tag-filter'
import ExtentFilter from './extent-filter'
import { CATALOGUE_CLIENT_FILTER_CONFIG } from '../../../../config'

export default ({ catalogue }) => {
  const theme = useTheme()

  return (
    <Fade in={Boolean(catalogue)}>
      <Grid container item xs={12} spacing={0}>
        {/* EXTENT FILTER */}
        <Grid item xs={12} style={{ position: 'relative' }}>
          <ExtentFilter title="Extent Filter" />
        </Grid>

        {/* CONFIGURABLE FILTERS */}
        {CATALOGUE_CLIENT_FILTER_CONFIG.map(({ id, title, field, boost }, i) => {
          const isLastFilter = i === CATALOGUE_CLIENT_FILTER_CONFIG.length - 1
          const items = catalogue?.summary.find(obj => {
            const agg = Object.entries(obj).find(([key]) => key === id)
            return agg
          })[id]

          return (
            <Grid key={id} item xs={12}>
              <TagFilter
                style={
                  isLastFilter
                    ? {
                        borderRadius: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
                      }
                    : {}
                }
                id={id}
                field={field}
                title={title}
                boost={boost}
                results={items}
              />
            </Grid>
          )
        })}
      </Grid>
    </Fade>
  )
}
