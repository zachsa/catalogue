import React, { useState, useEffect, createContext } from 'react'
import { useLocation } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

export const UriStateContext = createContext()

const getUriState = (split = false) => {
  const url = window.location.href
  const regex = /[?&]([^=#]+)=([^&#]*)/g
  const params = {}

  var match
  while ((match = regex.exec(url))) {
    params[match[1]] = split
      ? decodeURIComponent(match[2])
          .split(',')
          .map(item => decodeURIComponent(item))
          .filter(_ => _)
      : decodeURIComponent(match[2])
  }
  return params
}

export default ({ children }) => {
  const location = useLocation()
  const history = useHistory()
  const [state, setState] = useState(getUriState())

  useEffect(() => {
    setState(getUriState())
  }, [location])

  return (
    <UriStateContext.Provider
      value={{
        state,
        getUriState,
        setUriState: ({
          pathname = window.location.pathname,
          terms = getUriState(true).terms || [],
          preview = getUriState(true).preview || [],
          extent = getUriState(false).extent || '',
        }) => {
          history.push({
            pathname,
            search: `?terms=${encodeURIComponent(
              terms.map(term => encodeURIComponent(term)).join(',')
            )}&extent=${encodeURIComponent(extent)}&preview=${encodeURIComponent(
              preview.map(p => encodeURIComponent(p)).join(',')
            )}`,
          })
        },
      }}
    >
      {children}
    </UriStateContext.Provider>
  )
}