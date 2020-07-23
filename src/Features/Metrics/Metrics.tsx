import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import Select from '../../components/Select';
import { IState } from '../../store';

const query = `
query {
  getMetrics
}
`;

export default () => {
  const dispatch = useDispatch();
  const { metrics, selectedMetrics } = useSelector((state: IState) => state.metrics);

  const [result] = useQuery({
    query,
  });

  const { fetching, data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch(actions.metricsApiErrorReceived({ error: error.message }));
      return;
    }

    if (!data) return;

    dispatch(actions.metricsRecevied(data));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  const handleSelectedMetrics = (selectedMetrics: string[]) => {
    dispatch(actions.metricsSelected({ metrics: selectedMetrics }));
  };

  return <Select options={metrics} selected={selectedMetrics} selectedCallback={handleSelectedMetrics} />;
};
