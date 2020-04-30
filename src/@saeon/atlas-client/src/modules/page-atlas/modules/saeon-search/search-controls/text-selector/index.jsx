import React from 'react'
import { TextField, InputAdornment } from '@material-ui/core'
import { Search as SearchIcon } from '@material-ui/icons'

export default ({ updateForm, ...fields }) => {
  return (
    <TextField
      size="small"
      id="catalog-search-free-text"
      placeholder="e.g. atmospheric, water, etc."
      label="Text search"
      autoComplete="off"
      value={fields.textSearch}
      fullWidth
      margin="normal"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      InputLabelProps={{
        shrink: true,
      }}
      variant="outlined"
      onChange={({ target }) => updateForm({ textSearch: target.value })}
    />
  )
}
