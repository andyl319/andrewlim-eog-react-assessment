import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  header: {
    marginTop: '50px',
  },
}));

export default () => {
  const classes = useStyles();

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid className={classes.header} item>
        <Typography variant="h4">Dashboard</Typography>
      </Grid>
    </Grid>
  );
};
