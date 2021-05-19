import fetch from 'dva/fetch';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.message = errortext;
  error.response = response;
  throw error;
}

function streamReader(response) {
  const reader = response.body.getReader();
  const stream = new ReadableStream({
    start(controller) {
      // 下面的函数处理每个数据块
      function push() {
        // "done"是一个布尔型，"value"是一个Unit8Array
        reader.read().then(({ done, value }) => {
          // 判断是否还有可读的数据？
          if (done) {
            // 告诉浏览器已经结束数据发送。
            controller.close();
            return;
          }

          // 取得数据并将它通过controller发送给浏览器。
          controller.enqueue(value);
          push();
        });
      }

      push();
    },
  });

  return stream;
}

export const defaultConfig = {
  method: 'GET',
  baseUrl: 'http://www.jxvredu.com/courseware',
  headers: null,
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  return fetch(defaultConfig.baseUrl + url, newOptions)
    .then(checkStatus)
    .then(response => {
      const contentType =
        (response.headers.get('Content-type') &&
          response.headers.get('Content-type').split(';')[0]) ||
        'application/json';

      if (contentType === 'application/octet-stream') {
        return response.blob();
      }

      if (contentType === 'application/json') {
        const token = response.headers.get('Authorization');
        !token ? undefined : localStorage.setItem('token', token);

        return Promise.resolve(response.json());
      }
    })
    .then(data => {
      if (data instanceof Blob) {
        const reader = new FileReader();

        reader.readAsDataURL(data);
        return reader;
      }

      return data;
    })
    .catch(e => {
      const { dispatch } = store;
      const status = e.name;
      const response = { status, message: e.message };

      if (status === 401) {
        dispatch({
          type: 'login/logout',
        });
        return response;
      }
      if (status === 403) {
        dispatch(routerRedux.push('/exception/403'));
        return response;
      }
      if (status <= 504 && status >= 500) {
        dispatch(routerRedux.push('/exception/500'));
        return response;
      }
      if (status >= 404 && status < 422) {
        dispatch(routerRedux.push('/exception/404'));
        return response;
      }
    });
}
