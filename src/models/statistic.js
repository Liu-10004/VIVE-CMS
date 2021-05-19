import { status as ResourceStatus } from '../enums/ResourceStatus';

export default {
  namespace: 'statistic',

  state: {
    count: Object.keys(ResourceStatus).reduce(
      (previous, current) => Object.assign(previous, { [ResourceStatus[current]]: 0 }),
      {}
    ),
  },

  effects: {
    *fetchResourceStatus({ payload }, { call, put }) {},
  },

  reducers: {
    saveResourceStatus(state, { payload }) {
      return {
        ...state,
        count: payload.data.reduce(
          (previous, current) => Object.assign(previous, { [current.status]: current.count }),
          {}
        ),
      };
    },
  },
};
