import React from 'react';
import { Provider, createClient, defaultExchanges, subscriptionExchange } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Metrics from '../Features/Metrics/Metrics';
import Measurements from '../Features/Measurements/Measurements';

const useStyles = makeStyles(theme => ({
  header: {
    marginTop: '50px',
  },
}));

const subscriptionClient = new SubscriptionClient('ws://react.eogresources.com/graphql', {
  reconnect: true,
});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation),
    }),
  ],
});

export default () => {
  const classes = useStyles();

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid className={classes.header} item>
        <Typography variant="h4">Dashboard</Typography>
      </Grid>
      <Grid className={classes.header} item>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography>Select a Metric(s) to get started!</Typography>
        </div>
        <Provider value={client}>
          <Metrics />
        </Provider>
      </Grid>
      <Grid className={classes.header} item>
        <Provider value={client}>
          <Measurements />
        </Provider>
      </Grid>
    </Grid>
  );
};
