import React from 'react';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
    maxWidth: 700,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}));

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};

type OnChangeCallBack = (event: any) => void;

type SelectProps = {
  options: Array<string>;
  selected: Array<string>;
  selectedCallback: OnChangeCallBack;
};

export default ({ options, selected, selectedCallback }: SelectProps) => {
  const classes = useStyles();

  const handleChange = (event: any) => {
    selectedCallback(event.target.value);
  };

  return (
    <Paper elevation={5}>
      <FormControl className={classes.formControl}>
        <InputLabel>Metrics</InputLabel>
        <Select
          multiple
          value={selected}
          onChange={handleChange}
          input={<Input />}
          renderValue={selected => (
            <div className={classes.chips}>
              {(selected as string[]).map(value => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {options.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
};
