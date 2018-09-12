import { message } from 'antd';
import { addCourseware, updateCourseware, getToken } from 'services/api';
import { upload as uploadResource } from 'utils/aliOSS';

export default {
  namespace: 'courseware',

  state: {},

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
    *update({ payload }, { call }) {
      return yield call(updateCourseware, payload);
    },
  },

  reducers: {},
};
