import { getActivities } from './mock/api';
import { getStatus, getResources, getMaterialDetail, getCoursewareDetail } from './mock/resources';
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
          'CAIS3gJ1q6Ft5B2yfSjIr4mGIozgiZdC3fqjb2rpkkYiP/lLirHDjTz2IHhPe3VgBOAYvvU1nW9S6P8clr1tSoFISVGBNJYrscQIoVP4PNGc4ZQSV2nrAdn3d1KIAjvXgeUjCoeQFaEmE5XAQlTAkTAJjtmeXD6+XlujHISUgJp8FLo+VRW5ajw0Y7UzIRB5+vcHKVzbN/umLmTj4AzqAVFvpxB3hE5m9K272bf80BfFi0DgweJniubaK5O/Pc53J8U9AZXnwu1oe6bclSVU7AVGsb9sjbJN5TqA4onHU1Rf7kvYbuSJ/IQwIlcgOPU0RfVJpfbxyqUg4rSU1aaPkk0SYLsKCn+FGtzxkZadQNnEbIhpKezJXF3Wyc2KO5XPtAcpXGkWLgsieaB6ciQvVUxxGm+Ke/X+pwqUO1m5OKGB0bAr151u1Env/teMKFWJTq+QzSECIJg4YlP22v2JYd0xGBqAAQnAxQZBOUUOqC3qQd8eRFTX1n3GrzGgOe4mrEdP0Y+vNx1dbh20QqSZ0Pty8WjE4s3qwdZqtQ6mvrreOBWfiW0fqXtT/lULhChfpavPneBe3n9whGt0iES4QUl6/rjDn7WhRovr1NQXhovECx4NiI64e/KP32jZeHvbR6QcjM6C',
        accessKeySecret: '8HXmBF1kbcZoK64TwVjsKGzPvJ4x2FULUh3ngn8CS4Yy',
        accessKeyId: 'STS.NJ3i6TdHcj8HmLXvFw3vgetho',
        expiration: '2018-09-25T13:33:37Z',
        bucket: 'vivedu-cloud-private',
        key: '4028efe665f5f17f0165f63eafe70000/',
        region: 'oss-cn-beijing',
      },
    });
  },
  'GET /api/resources/status': getStatus,
  'GET /api/materials': getResources,
  'GET /api/coursewares': getResources,
  'GET /api/coursewares/:id': getCoursewareDetail,
  'GET /api/materials/:id': getMaterialDetail,
  'DELETE /api/coursewares/:id': (req, res) => {
    res.send({
      message: 'success',
      data: '删除成功',
    });
  },
  'DELETE /api/materials/:id': (req, res) => {
    res.send({
      message: 'success',
      data: '删除成功',
    });
  },
  'POST /api/materials': (req, res) => {
    res.send({
      message: 'success',
      data: '4028efe665f5f17f0165f63eafe70000',
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
