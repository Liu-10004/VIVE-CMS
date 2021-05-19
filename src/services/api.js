import { stringify } from 'qs';
import request from 'utils/request';

export async function queryActivities() {
  return request('/api/activities');
}

export async function fakeAccountLogin(params) {
  return request('/auth/login', {
    method: 'POST',
    body: {
      username: params.account,
      password: params.password,
      rememberMe: true,
    },
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryExcel() {
  const token = localStorage.getItem('token');

  return request('/api/schools/export', {
    headers: {
      Authorization: token,
      'Content-Type': 'application/octet-stream',
    },
  });
}

export async function querySchools(params) {
  const token = localStorage.getItem('token');
  const query = {
    order_field: 'createTime',
    order_type: 'desc',
    size: params.pageSize,
    start: params.page,
  };

  return request(`/api/schools?${stringify(query)}`, {
    headers: {
      Authorization: token,
    },
  });
}

export async function querySchoolDetails(params) {
  const token = localStorage.getItem('token');
  return request(`/api/schools/user_id/${params.userId}/all`, {
    headers: {
      Authorization: token,
    },
  });
}

export async function updateSchools(params) {
  const token = localStorage.getItem('token');
  return request('/api/schools', {
    method: 'PUT',
    body: params,
    headers: {
      Authorization: token,
    },
  });
}
