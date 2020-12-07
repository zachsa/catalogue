import { useContext } from 'react'
import { IconButton, Tooltip } from '@material-ui/core'
import DeleteIcon from 'mdi-react/DeleteIcon'
import { context as databookContext } from '../../../../context'
import { useApolloClient, gql } from '@apollo/client'

const CHARTS = gql`
  query($id: ID!) {
    databook(id: $id) {
      id
      charts {
        id
        name
      }
    }
  }
`

export default ({ id, setActiveTabIndex }) => {
  const client = useApolloClient()
  const { databook } = useContext(databookContext)

  return (
    <Tooltip title="Delete current dashboard" placement="left-start">
      <span style={{ zIndex: 99, position: 'absolute', right: 4, bottom: 4 }}>
        <IconButton
          onClick={async () => {
            await client.mutate({
              mutation: gql`
                mutation($id: ID!) {
                  deleteChart(id: $id)
                }
              `,
              variables: {
                id,
              },
              update: (cache, { data }) => {
                const result = data.deleteChart

                if (!result) {
                  throw new Error('Unable to delete chart')
                }

                const newDatabook = { ...databook }
                newDatabook.charts = [...databook.charts].filter(({ id: existingId }) => {
                  return existingId !== id
                })

                cache.writeQuery({
                  query: CHARTS,
                  data: { databook: newDatabook },
                })
              },
            })
          }}
          size="small"
        >
          <DeleteIcon size={20} />
        </IconButton>
      </span>
    </Tooltip>
  )
}
