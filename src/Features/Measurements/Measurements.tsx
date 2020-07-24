import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSubscription, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import { actions } from './reducer';
import { IState } from '../../store';
import Graph from '../../components/Graph';
import KPI from '../../components/KPI';

const measurementSubscription = `
subscription {
  newMeasurement {
    metric,
    at,
    value,
    unit
  }
}
`;

const getMeasurementsByTime = `
query ($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input) {
    metric,
    measurements {
      at
      value
      unit
    }
  }
}
`;

const startTime = Date.now() - 1800000;
export default () => {
  const dispatch = useDispatch();
  const { selectedMetrics } = useSelector((state: IState) => state.metrics);
  const measurements = useSelector((state: IState) => state.measurements);

  const [measurementSubscriptionResult] = useSubscription({ query: measurementSubscription, pause: false });

  const { fetching, data, error } = measurementSubscriptionResult;

  useEffect(() => {
    if (error) {
      dispatch(actions.measurementApiErrorReceived({ error: error.message }));
      return;
    }

    if (!data) return;

    dispatch(actions.measurementReceived(data.newMeasurement));
  }, [dispatch, data, error]);

  const [measurementsByTimeResult] = useQuery({
    query: getMeasurementsByTime,
    variables: {
      input: selectedMetrics.map(metric => {
        // start 30 min prior
        return { metricName: metric, after: startTime };
      }),
    },
  });

  useEffect(() => {
    const { data } = measurementsByTimeResult;

    if (!data) return;

    dispatch(actions.measurementsByTimeReceived(data.getMultipleMeasurements));
  }, [dispatch, measurementsByTimeResult]);

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
