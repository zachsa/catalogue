import { lazy, Suspense, useRef } from 'react'
import { Loading } from '../../components'
import SideMenu from './side-menu'
import { useCatalogue as WithCatalogue, WithQglQuery } from '../../hooks'
import { getUriState } from '../../lib/fns'
import { gql } from '@apollo/client'
import { CLIENT_HOST_ADDRESS, MAX_ATLAS_DATASETS } from '../../config'
import { setShareLink } from './../../hooks'

const MenuProvider = lazy(() => import('@saeon/snap-menus/src/provider'))
const OlReactProvider = lazy(() => import('../../contexts/ol-react'))
const StateProvider = lazy(() => import('./state'))
const Map = lazy(() => import('./map'))

export default () => {
  const snapMenusContainer = useRef()
  const atlasId = getUriState().atlas
  if (!atlasId) {
    throw new Error(
      `The ATLAS requires prior-configuration of what layers to show. This is done at ${CLIENT_HOST_ADDRESS}/records`
    )
  }

  setShareLink({
    uri: `${CLIENT_HOST_ADDRESS}/render/atlas?atlas=${atlasId}`,
    params: false,
  })

  return (
    <div
      ref={snapMenusContainer}
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
      }}
    >
      <WithQglQuery
        QUERY={gql`
          query($id: ID!) {
            browserClient {
              findAtlas(id: $id)
            }
          }
        `}
        variables={{ id: atlasId }}
      >
        {({ error, loading, data }) => {
          if (error) {
            throw new Error('Error loading search state for Atlas')
          }

          return loading ? (
            <Loading />
          ) : (
            <WithCatalogue {...data?.browserClient.findAtlas} pageSize={MAX_ATLAS_DATASETS}>
              {({ error, loading, data }) => {
                if (error) {
                  throw new Error('Error searching catalogue')
                }

                if (data?.catalogue.records.totalCount > MAX_ATLAS_DATASETS) {
                  throw new Error(
                    `Atlas supports a maximum of ${MAX_ATLAS_DATASETS} datasets. ${data.catalogue.records.totalCount} datasets were specified`
                  )
                }

                return loading ? (
                  <Loading />
                ) : (
                  <Suspense fallback={<Loading />}>
                    <OlReactProvider>
                      <Suspense fallback={null}>
                        <StateProvider data={data}>
                          <Suspense fallback={null}>
                            <MenuProvider
                              MARGIN_TOP={5}
                              MARGIN_RIGHT={5}
                              MARGIN_BOTTOM={5}
                              MARGIN_LEFT={5}
                              SNAP_MENUS_CONTAINER_REF={snapMenusContainer}
                            >
                              <SideMenu snapMenusContainer={snapMenusContainer} />
                              <Map />
                            </MenuProvider>
                          </Suspense>
                        </StateProvider>
                      </Suspense>
                    </OlReactProvider>
                  </Suspense>
                )
              }}
            </WithCatalogue>
          )
        }}
      </WithQglQuery>
    </div>
  )
}
