import { message } from 'antd';
import {
  addCourseware,
  queryCoursewares,
  updateCourseware,
  deleteCourseware,
  getToken,
} from 'services/api';
import { upload as uploadResource } from 'utils/aliOSS';

export default {
  namespace: 'courseware',

  state: {
    data: [],
    pages: {
      totalElements: 0,
      size: 20,
      number: 0,
    },
  },

  effects: {
    *add({ payload }, { all, call }) {
      const { thumbnails } = payload;
      // eslint-disable-next-line no-param-reassign
      delete payload.thumbnails;
      let response = yield call(addCourseware, payload);
      const coursewareId = response.data;
      if (response.message === 'success') {
        // 请求 ali-oss token
        response = yield call(getToken, { tokenType: 2, id: coursewareId });
        if (response.message === 'success') {
          response = yield all(
            thumbnails.fileList.map(file =>
              call(uploadResource, { file: file.originFileObj, token: response.data })
            )
          );
          if (response.every(item => item.message === 'success')) {
            const params = {
              ...payload,
              id: coursewareId,
              thumbnails: response.map(file => file.fileUrl).toString(),
            };
            return params;
          }
        }
      } else {
        message.error('上传失败，检查网络后再试！');
      }
    },

    // 资源管理，fetch 数据
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryCoursewares, payload);

      if (response.message === 'success') {
        yield put({
          type: 'save',
          payload: response.data,
        });
      }
    },

    *update({ payload }, { call, put, select }) {
      const response = yield call(updateCourseware, payload);

      // 下架
      if (payload.status === '4' && response.message === 'success') {
        const courseware = yield select(state => state.courseware);
        const dataSource = courseware.data;
        const pages = courseware.pages;

        yield put({
          type: 'save',
          payload: {
            ...pages,
            totalElements: pages.totalElements - 1,
            content: dataSource.filter(item => item.id !== payload.id),
          },
        });
      }

      return response;
    },

    *delete({ payload }, { call, put, select }) {
      const response = yield call(deleteCourseware, payload);

      if (response.message === 'success') {
        const courseware = yield select(state => state.materials);
        const dataSource = courseware.data;
        const pages = courseware.pages;

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
