import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import CloseIcon from 'mdi-react/CloseIcon'
import AutoComplete from '../autocomplete'
import useStyles from './style.js'
import clsx from 'clsx'
/**
 * TO-DO:
 * Ellipsis overflow needs work
 * textfield/icon grid layout sizing values can be cleaned up
 * general padding can be cleaned up
 */
export default ({ options, selectedOptions, setOption, label, icon: Icon }) => {
  const classes = useStyles()
  return (
    <>
      {/* TextField */}
      <Grid container spacing={1} alignItems="flex-end">
        {Icon ? (
          <Grid item>
            <Icon />
          </Grid>
        ) : undefined}
        <Grid item xs={12} sm={Icon ? 11 : 12}>
          <AutoComplete
            multiple
            options={options}
            selectedOptions={selectedOptions}
            setOption={setOption}
            label={label}
            renderTags={() => {}} //rendering no tags
          />
        </Grid>
      </Grid>

      {/* Selected Items List */}
      <ul className={clsx(classes.list)}>
        {selectedOptions?.map((value, i) => {
          return (
            <li
              key={i}
              className={clsx(classes.listItem)}
              onClick={() => {
                let updatedOptions = [...selectedOptions]
                updatedOptions.splice(i, 1)
                setOption(updatedOptions)
              }}
            >
              <Grid container>
                <Grid item xs={12} sm={11} className={clsx(classes.gridText)}>
                  {value}
                </Grid>
                <Grid item xs={12} sm={1}>
                  <IconButton className={clsx(classes.listItemClose)} disabled>
                    <CloseIcon size={20} />
                  </IconButton>
                </Grid>
              </Grid>
            </li>
          )
        })}
      </ul>
    </>
  )
}