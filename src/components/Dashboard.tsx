import React from 'react';
import { Provider, createClient } from 'urql';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Metrics from '../Features/Metrics/Metrics';

const useStyles = makeStyles(theme => ({
  header: {
    marginTop: '50px',
  },
}));

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

export default () => {
  const classes = useStyles();

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid className={classes.header} item>
        <Typography variant="h4">Dashboard</Typography>
      </Grid>
      <Grid className={classes.header} item>
        <Provider value={client}>
          <Metrics />
        </Provider>
      </Grid>
    </Grid>
  );
};
