import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSubscription } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import { actions } from './reducer';
import { IState } from '../../store';
import Graph from '../../components/Graph';
import KPI from '../../components/KPI';

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
    <Grid container direction="column" justify="center" alignItems="center" spacing={6}>
      <Graph labels={selectedMetrics} data={measurements} />
      <Grid item>
        <Grid container direction="row" alignItems="center" spacing={5}>
          {selectedMetrics.map(metric => {
            const lastPoint = measurements[metric][measurements[metric].length - 1];
            return (
              <Grid key={`kpi-${metric}`} item>
                <KPI measurement={lastPoint} />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};
