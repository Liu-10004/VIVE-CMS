import { message } from 'antd';
import { queryResourceStatus } from '../services/api';
import { status as ResourceStatus } from '../enums/ResourceStatus';

export default {
  namespace: 'resource',

  state: {
    count: Object.keys(ResourceStatus).reduce(
      (previous, current) => Object.assign(previous, { [ResourceStatus[current]]: 0 }),
      {}
    ),
  },

  effects: {
    *fetchStatus({ payload }, { call, put }) {
      const response = yield call(queryResourceStatus, payload);

      if (response.message === 'success') {
        yield put({
          type: 'saveStatus',
          payload: response,
        });
      }
    },
  },

  reducers: {
    saveStatus(state, { payload }) {
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
