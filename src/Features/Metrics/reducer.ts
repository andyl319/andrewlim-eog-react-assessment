import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Metrics = {
  getMetrics: string[];
};

export type SelectedMetrics = {
  metrics: string[];
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  metrics: [] as string[],
  selectedMetrics: [] as string[],
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricsRecevied: (state, action: PayloadAction<Metrics>) => {
      const { getMetrics } = action.payload;
      state.metrics = getMetrics.sort();
    },
    metricsSelected: (state, action: PayloadAction<SelectedMetrics>) => {
      const { metrics } = action.payload;
      state.selectedMetrics = metrics.sort();
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
