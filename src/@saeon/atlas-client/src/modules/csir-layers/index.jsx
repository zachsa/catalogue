import React, { Component } from 'react'
import { Card, CardHeader } from '@material-ui/core'
import esriLayers from './layers'
import { Checkbox } from '@material-ui/core'
import { createLayer, LayerTypes } from '../../lib/ol'
import { Typography } from '@material-ui/core'
import InfoMenu from './_info-menu'
import LegendMenu from './_legend-menu'

const ATLAS_API_ADDRESS = process.env.ATLAS_API_ADDRESS || 'http://localhost:4000'

const fetchMeta = (uri) => fetch(`${uri}?f=pjson`).then((res) => res.json())

export default class extends Component {
  state = {
    esriLayers: [],
    loading: true,
  }

  async componentDidMount() {
    this.setState({
      loading: false,
      esriLayers: Object.fromEntries(
        await Promise.all(
          esriLayers.map((uri) =>
            Promise.all([
              uri,
              fetchMeta(
                uri.replace(
                  'https://pta-gis-2-web1.csir.co.za/server2/rest/services',
                  `${ATLAS_API_ADDRESS}/csir`
                )
              ),
            ])
          )
        )
      ),
    })
  }

  shouldComponentUpdate() {
    return true
  }

  render() {
    const { proxy } = this.props
    const { esriLayers, loading } = this.state
    return loading ? (
      <Typography>Loading ...</Typography>
    ) : (
      <div style={{ height: '100%', overflow: 'auto', paddingRight: 5 }}>
        {Object.entries(esriLayers).map(([uri, { mapName, currentVersion }], i) => (
          <Card key={i} style={{ margin: 5 }} variant="outlined" square={true}>
            <CardHeader
              titleTypographyProps={{
                variant: 'overline',
              }}
              subheaderTypographyProps={{
                variant: 'caption',
              }}
              title={mapName || 'UNKNOWN TITLE'}
              subheader={`VERSION ${currentVersion}`}
              action={
                <Checkbox
                  style={{ float: 'right' }}
                  size="small"
                  edge="start"
                  checked={proxy.getLayerById(uri) ? true : false}
                  onChange={({ target }) => {
                    const proxiedUri = uri.replace(
                      'https://pta-gis-2-web1.csir.co.za/server2/rest/services',
                      `${ATLAS_API_ADDRESS}/csir`
                    )
                    const { checked } = target
                    if (checked) {
                      proxy.addLayer(
                        createLayer({
                          InfoMenu: () => (
                            <InfoMenu uri={`${proxiedUri}/layers?f=pjson`} title={mapName} />
                          ),
                          LegendMenu: () => (
                            <LegendMenu uri={`${proxiedUri}/legend?f=pjson`} title={mapName} />
                          ),
                          layerType: LayerTypes.TileArcGISRest,
                          id: uri,
                          uri: proxiedUri,
                          title: mapName,
                        })
                      )
                    } else {
                      proxy.removeLayerById(uri)
                    }
                  }}
                />
              }
            />
          </Card>
        ))}
      </div>
    )
  }
}