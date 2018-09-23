import { message } from 'antd';
import { queryMaterials, updateMaterial, deleteMaterial } from '../services/api';

export default {
  namespace: 'material',

  state: {
    data: [],
    pages: {
      totalElements: 0,
      size: 20,
      number: 0,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryMaterials, payload);

      if (response.message === 'success') {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },

    *update({ payload }, { call, put, select }) {
      const response = yield call(updateMaterial, payload);

      if (payload.status === '4' && response.message === 'success') {
        const material = yield select(state => state.material);
        const dataSource = material.data;
        const pages = material.pages;

        yield put({
          type: 'save',
          payload: {
            ...pages,
            content: dataSource.filter(item => item.id !== payload.id),
            totalElements: pages.totalElements - 1,
          },
        });
      }

      return response;
    },

    *delete({ payload }, { call, put, select }) {
      const response = yield call(deleteMaterial, payload);

      if (response.message === 'success') {
        const material = yield select(state => state.material);
        const dataSource = material.data;
        const pages = material.pages;

        yield put({
          type: 'save',
          payload: {
            ...pages,
            content: dataSource.filter(item => item.id !== payload.id),
          },
        });
      }

      return response;
    },
  },

  reducers: {
    save(
      state,
      {
        payload: { content, size, number, totalElements },
      }
    ) {
      return {
        ...state,
        data: content.map((item, index) => ({
          ...item,
          index: size * number + index + 1,
        })),
        pages: {
          totalElements,
          size,
          number,
        },
      };
    },
  },
};
