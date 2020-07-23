import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as metricsReducer } from '../Features/Metrics/reducer';
import { reducer as measurementsReducer } from '../Features/Measurements/reducer';

export default {
  weather: weatherReducer,
  metrics: metricsReducer,
  measurements: measurementsReducer,
};
