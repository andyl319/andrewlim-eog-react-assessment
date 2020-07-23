import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { useSubscription } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { IState } from '../../store';
import Grid from '@material-ui/core/Grid';

const query = `
subscription {
  newMeasurement {
    metric,
    at,
    value,
    unit
  }
}
`;

export default () => {
  const dispatch = useDispatch();
  const { selectedMetrics } = useSelector((state: IState) => state.metrics);
  const measurements = useSelector((state: IState) => state.measurements);

  const [result] = useSubscription({ query, pause: false });

  const { fetching, data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch(actions.measurementApiErrorReceived({ error: error.message }));
      return;
    }

    if (!data) return;

    dispatch(actions.measurementReceived(data.newMeasurement));
  }, [dispatch, data, error]);

  if (fetching && !data) return <LinearProgress />;

  return (
    <Grid container direction="column" justify="center" alignItems="center" spacing={4}>
      <div>{`${selectedMetrics}`}</div>
      <Grid item xs>
        {Object.keys(measurements).map(metric => (
          <div key={metric}>
            <div>{metric}</div>
            <div>
              {measurements[metric].length > 0 ? measurements[metric][measurements[metric].length - 1].value : 0}
            </div>
          </div>
        ))}
      </Grid>
    </Grid>
  );
};
