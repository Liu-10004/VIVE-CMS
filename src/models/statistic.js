import { queryResourceStatus } from '../services/api';
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
    *fetchResourceStatus({ payload }, { call, put }) {
      let response;
      if (payload.role) {
        response = yield call(queryResourceStatus, payload);
      } else {
        response = yield call(queryResourceStatus);
      }

      if (response.message === 'success') {
        yield put({
          type: 'saveResourceStatus',
          payload: response,
        });
      }
    },
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
