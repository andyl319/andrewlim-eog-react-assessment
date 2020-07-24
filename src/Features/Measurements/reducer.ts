import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Measurement = {
  metric: string;
  at: number;
  value: number;
  unit: string;
};

export type MeasurementsByTime = [{ measurements: Measurement[]; metric: string }];

export type ApiErrorAction = {
  error: string;
};

const initialState: { [metric: string]: Measurement[] } = {};
// number of points per 30 minute window
const pointsPerWindow = 1800 / 1.3;

const slice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    measurementReceived: (state, action: PayloadAction<Measurement>) => {
      const { metric, at, value, unit } = action.payload;
      if (state[metric] === undefined) {
        state[metric] = [{ metric, at, value, unit }];
      } else {
        state[metric].push({ metric, at, value, unit });
      }

      const numPoints = state[metric].length;
      const numPointsToDiscard = pointsPerWindow - numPoints;

      if (numPointsToDiscard < 0) {
        state[metric].shift();
      }
    },
    measurementsByTimeReceived: (state, action: PayloadAction<MeasurementsByTime>) => {
      const multipleMeasurements = action.payload;
      for (let i = 0; i < multipleMeasurements.length; i++) {
        let { metric, measurements } = multipleMeasurements[i];
        const numPointsToDiscard = pointsPerWindow - measurements.length;
        if (numPointsToDiscard < 0) {
          measurements.slice(Math.abs(numPointsToDiscard));
        }
        state[metric] = measurements;
      }
    },
    measurementApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
