import { querySchools, updateSchools, querySchoolDetails, queryExcel } from 'services/api';
import { formatDate } from 'utils/time';

export default {
  namespace: 'courseware',
  state: {
    data: [],
    pages: {
      totalElements: 0,
      size: 20,
      number: 0,
    },
    nextId: false,
    details: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySchools, payload);

      if (response) {
        yield put({
          type: 'save',
          payload: response,
        });
        return response;
      }
    },

    *export({}, { call }) {
      const response = yield call(queryExcel);

      if (response) {
        response.onload = function(e) {
          const excelFile = document.createElement('a');

          excelFile.download = '报名信息统计表.xls';
          excelFile.style.display = 'none';
          excelFile.href = e.target.result;
          document.body.appendChild(excelFile);
          excelFile.click();
          document.body.removeChild(excelFile);
        };
      }
    },

    *update({ payload }, { call }) {
      return yield call(updateSchools, payload);
    },

    *fetchDetail({ payload }, { call, put, select }) {
      const response = yield call(querySchoolDetails, payload);
      const { data } = yield select(state => state.courseware);
      let nextIndex = 0;

      data.find((item, index) => {
        if (item.userId === payload.userId) {
          nextIndex = index + 1;

          return true;
        }

        return false;
      });

      if (response) {
        yield put({
          type: 'saveDetails',
          payload: {
            details: response,
            nextId: nextIndex <= data.length - 1 ? data[nextIndex].userId : false,
          },
        });
        return response;
      }
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

    saveDetails(state, { payload }) {
      return { ...state, details: payload.details, nextId: payload.nextId };
    },
  },
};
