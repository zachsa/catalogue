import React, { createContext, useState } from 'react'
import { useMenu } from '@saeon/snap-menus'
import Tabs from './tabs'

export const SideMenuContext = createContext()
export const TabsContext = createContext()

const TabContextProvider = ({ children }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  return (
    <TabsContext.Provider value={{ activeTabIndex, setActiveTabIndex }}>
      {children}
    </TabsContext.Provider>
  )
}

export default ({ snapMenusContainer }) => {
  const RecordsMenu = useMenu({ id: 'records' })

  return (
    <RecordsMenu
      defaultHeight={snapMenusContainer.current?.offsetHeight - 30}
      defaultWidth={300}
      defaultPosition={{ x: 10, y: 10 }}
      draggable={false}
      resizable={false}
      open={true}
      title={'Data Explorer'}
    >
      {({ width, height }) => {
        return (
          <SideMenuContext.Provider value={{ width, height }}>
            <TabContextProvider>
              <Tabs />
            </TabContextProvider>
          </SideMenuContext.Provider>
        )
      }}
    </RecordsMenu>
  )
}