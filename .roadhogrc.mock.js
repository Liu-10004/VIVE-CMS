import { getActivities } from './mock/api';
import { getStatus, getResources } from './mock/resources';
import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: '获取当前用户接口',
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'GET /api/activities': getActivities,
  'POST /api/coursewares': (req, res) => {
    res.send({
      message: 'success',
      data: '4028efe665d5dcbf0165d5dd389a0006',
    });
  },
  'PUT /api/coursewares/:id': (req, res) => {
    res.send({ message: 'success' });
  },
  'PUT /api/materials/:id': (req, res) => {
    res.send({ message: 'success' });
  },
  'GET /api/token': (req, res) => {
    res.send({
      message: 'success',
      data: {
        securityToken:
          'CAIS3QJ1q6Ft5B2yfSjIr4mAOf/cj6ts0feqZmXBi3E/eN17lf3A1Dz2IHhPe3VgBOAYvvU1nW9S6P8clr1tSoFISVGBNJYrsckOq1/6ONea45QNKje0P9n3d1KIAjvXgeUiCoeQFaEnE5XAQlTAkTAJjtmeXD6+XlujHISUgJp8FLo+VRW5ajw0Y7UzIRB5+vcHKVzbN/umLmTi4AzqAVFvpxB3hE5m9K272bf80BfFi0DgweJni+bbK5O/Pc53J8U9AZXnwu1oe6bclSVU7AVGsb9rhqhF8nCb5ovNDldcvUvbP7fY+ddhdFYnO6RnF6If/Kn1zaUg5KuRtfyukEkQZ74MCH6BGNHxnZKcIo7zaIZlL4ScEm/Wz9WCOqPytw4Zen8BPGtIAYF5cSAsWUF8FGGLcPb4og6TPB3QQqyEwbww1oFu01Lr8NyFKl6CWbyF1jwCPZsxf53F1IGqbLyLGoABIg7l2krn70I/c42ttOSQOwodMWtdbz4Ql5nmQRmlDPu/u94oB280xgCEZkHeT0dTCkRSqG150DYCoAPfAcK4japyeXH196FnO3BMlyS9nRskSkKqu2I5Q7pkwpyThCN5/6YqY5ZIF58vvlxR/dZ++yYybkRgBzrgdZT+rZhISWw=',
        accessKeySecret: 'CgnG3paESL2V5FJB4vVspqHp9Zt9bxqmTerdatDjjxnE',
        accessKeyId: 'STS.NJ5rEhbtMf5AdCpoqjtRWz8k6',
        expiration: '2018-09-21T07:47:14Z',
        bucket: 'vivedu-cloud-public',
        key: '4028efe665d5dcbf0165d5dd389a0006/',
        region: 'oss-cn-beijing',
      },
    });
  },
  'GET /api/resources/status': getStatus,
  'GET /api/materials': getResources,
  'GET /api/coursewares': getResources,
  'POST /api/materials': (req, res) => {
    res.send({
      message: 'success',
      data: '4028efe965cc80940165cc80e03e0000',
    });
  },
  'POST /api/login': (req, res) => {
    const { password, account } = req.query;
    if (password === '888888' && account === 'admin') {
      res.send({
        message: 'success',
        data: {
          currentAuthority: 'admin',
          account,
        },
      });
      return;
    }
    if (password === '123456' && account === 'user') {
      res.send({
        message: 'success',
        data: {
          currentAuthority: 'user',
          account,
        },
      });
      return;
    }
    res.send({
      status: 'error',
      currentAuthority: 'guest',
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};

export default (noProxy ? {} : delay(proxy, 1000));
