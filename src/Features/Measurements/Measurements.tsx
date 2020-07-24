import React, { useEffect, useState } from 'react';
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

export default () => {
  const dispatch = useDispatch();

  const { selectedMetrics } = useSelector((state: IState) => state.metrics);
  const measurements = useSelector((state: IState) => state.measurements);

  const [pause, togglePause] = useState(false);
  const [windowTime, userScroll] = useState({ startTime: Date.now() - 1800000, endTime: Date.now() });

  const [measurementSubscriptionResult] = useSubscription({ query: measurementSubscription, pause });
  const { fetching, data, error } = measurementSubscriptionResult;

  const [measurementsByTimeResult] = useQuery({
    query: getMeasurementsByTime,
    variables: {
      input: selectedMetrics.map(metric => {
        // start 30 min prior
        return { metricName: metric, after: windowTime.startTime, before: windowTime.endTime };
      }),
    },
  });

  useEffect(() => {
    if (error) {
      dispatch(actions.measurementApiErrorReceived({ error: error.message }));
      return;
    }

    if (!data) return;

    dispatch(actions.measurementReceived(data.newMeasurement));
  }, [dispatch, data, error]);

  useEffect(() => {
    const { data } = measurementsByTimeResult;

    if (!data) return;

    dispatch(actions.measurementsByTimeReceived(data.getMultipleMeasurements));
  }, [dispatch, measurementsByTimeResult]);

  if (fetching && !data) return <LinearProgress />;

  const handleUserScroll = (event: any) => {
    // if not paused, pause the subscription
    if (!pause) {
      togglePause(!pause);
    }

    let newStart;
    let newEnd;

    // scroll up = back in time
    if (event.deltaY < 0) {
      newStart = windowTime.startTime - 300000;
      newEnd = windowTime.endTime - 300000;
    } else {
      newStart = windowTime.startTime + 300000;
      newEnd = windowTime.endTime + 300000;
      if (newEnd > Date.now()) {
        newEnd = Date.now();
        newStart = newEnd - 1800000;
      }
    }
    userScroll({ startTime: newStart, endTime: newEnd });
  };

  const handlePause = () => {
    if (pause) {
      const newEnd = Date.now();
      const newStart = newEnd - 1800000;
      userScroll({ startTime: newStart, endTime: newEnd });
    }
    togglePause(!pause);
  };

  return (
    <Grid container direction="column" justify="center" alignItems="center" spacing={6}>
      <Graph
        handleUserScroll={handleUserScroll}
        labels={selectedMetrics}
        data={measurements}
        togglePause={handlePause}
        pause={pause}
      />
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
