import React from 'react'
import { useHistory } from 'react-router-dom'
import { Card, CardHeader, CardContent, Typography, Chip, Grid } from '@material-ui/core'

const aggregationHeaders = {
  subject: 'Data Tags',
  publicationYear: 'Publication Year',
  publisher: 'Publisher',
}

const getTitleFromField = field => (
  <Typography variant="h5">
    {aggregationHeaders[field.replace('.raw', '').replace(/.*\./, '')]}
  </Typography>
)

const getSearchState = () =>
  decodeURIComponent(window.location.search.replace('?search=', ''))
    .split(',')
    .filter(_ => _)

export default ({ results }) => {
  const history = useHistory()

  return (
    <>
      {results
        .map(aggregationSummary =>
          Object.entries(aggregationSummary).map(([field, data]) => (
            <Card
              key={field}
              style={{ margin: '0px 16px 20px 0px', padding: 20 }}
              variant="outlined"
            >
              <CardHeader title={getTitleFromField(field)} />
              <CardContent>
                <Grid container>
                  {data.map(({ key, doc_count }) => (
                    <Grid key={key} style={{ flexBasis: 300, flexGrow: 0 }} item>
                      <Chip
                        color={getSearchState().includes(key) ? 'secondary' : 'default'}
                        style={{ margin: '5px 5px 5px 0px' }}
                        clickable
                        variable="default"
                        onClick={() => {
                          const activeSubjects = getSearchState()
                          if (activeSubjects.includes(key)) {
                            activeSubjects.splice(activeSubjects.indexOf(key), 1)
                            history.push({
                              pathname: window.location.pathname,
                              search: `?search=${encodeURIComponent(activeSubjects.join(','))}`,
                            })
                          } else {
                            history.push({
                              pathname: window.location.pathname,
                              search: `?search=${encodeURIComponent(
                                [...new Set([...getSearchState(), key])].join(',')
                              )}`,
                            })
                          }
                        }}
                        size="small"
                        label={
                          <Typography variant="overline">{`${
                            typeof key === 'string' ? key.toUpperCase() : key
                          } (${doc_count})`}</Typography>
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          ))
        )
        .flat()}
    </>
  )
}