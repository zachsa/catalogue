// import React, { useState } from 'react';
// import clsx from 'clsx'
import useStyles from './style'
import TreeItem from './tree-item'
// import { FixedSizeList as List } from 'react-window';

export default props => {
  const schema = props.databook.schema
  const tables = schema.tables
  const classes = useStyles()
  return (
    <>
      <TreeItem expandable={true} primaryText={schema.id} secondaryText={''} itemDepth={0}>
        {/* Mapping array of Tables */}
        {tables.map(table => {
          return (
            <TreeItem
              key={table.id}
              expandable={true}
              primaryText={table.id}
              secondaryText={''}
              itemDepth={1}
            >
              {/* Mapping array of Columns */}
              {table.fields.map((col, j) => {
                return (
                  <TreeItem
                    key={j}
                    expandable={false}
                    primaryText={col.column_name}
                    secondaryText={col.data_type}
                    itemDepth={2}
                  ></TreeItem>
                )
              })}
            </TreeItem>
          )
        })}
      </TreeItem>
    </>
  )
}