import {
  queryMaterials,
  addMaterial,
  updateMaterial,
  deleteMaterial,
  getToken,
} from 'services/api';
import { upload as uploadResource } from 'utils/aliOSS';

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

    *addModel({ payload }, { call, all, select }) {
      const addMaterialResponse = yield call(addMaterial, payload);

      if (addMaterialResponse.message === 'success') {
        const materialID = addMaterialResponse.data;
        const params = { id: materialID };

        const thumbnailToken = yield call(getToken, { tokenType: 2, id: materialID });
        const fileToken = yield call(getToken, { tokenType: 1, id: materialID });

        if (thumbnailToken.message === 'success') {
          const { thumbnails } = yield select(state => state.material);
          const thumbnailsResponse = yield all(
            thumbnails.map(thumbnail =>
              call(uploadResource, {
                thumbnail: thumbnail.originFileObj,
                token: thumbnailToken.data,
              })
            )
          );

          if (thumbnailsResponse.every(thumbnail => thumbnail.message === 'success')) {
            Object.assign(params, {
              thumbnails: thumbnails.map(thumbnail => thumbnail.name).toString(),
            });
          }
        }

        if (fileToken.message === 'success') {
          const { files } = yield select(state => state.material);
          const fileResponse = yield all(
            files.map(file =>
              call(uploadResource, {
                file,
                token: fileToken.data,
              })
            )
          );

          if (fileResponse.every(file => file.message === 'success')) {
            Object.assign(params, {
              file: files[0].name,
            });
          }
        }

        if ('thumbnails' in params && 'file' in params) {
          return params;
        }
      }
    },

    *update({ payload }, { call, put, select }) {
      const response = yield call(updateMaterial, payload);

      if (response.message === 'success') {
        if (payload.status === '4') {
          const material = yield select(state => state.material);
          const { data: dataSource, pages } = material;

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
      }
    },

    *delete({ payload }, { call, put, select }) {
      const response = yield call(deleteMaterial, payload);

      if (response.message === 'success') {
        const material = yield select(state => state.material);
        const { data: dataSource, pages } = material;

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

    saveUploadFiles(
      state,
      {
        payload: { thumbnails, files },
      }
    ) {
      return {
        ...state,
        thumbnails,
        files,
      };
    },
  },
};
