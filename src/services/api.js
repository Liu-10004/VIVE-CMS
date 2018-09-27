import { stringify } from 'qs';
import request from 'utils/request';

export async function queryActivities() {
  return request('/api/activities');
}

export async function fakeAccountLogin(params) {
  return request(`/api/login?${stringify(params)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取更新资源的 ali-oss token
 * @param {number} type 资源类型，取值为：0.(首页轮播图); 1.(封面); 2.(资源)
 * @param {string} id 资源 id
 */
export async function getToken(params) {
  return request(`/api/token?${stringify(params)}`);
}

export async function addCourseware(params) {
  return request('/api/coursewares', {
    method: 'POST',
    body: params,
  });
}

export async function queryResourceStatus(params) {
  const query = params ? `?${stringify(params)}` : '';

  return request(`/api/resources/status${query}`);
}

export async function queryMaterials(params) {
  return request(`/api/materials?${stringify(params)}`);
}

export async function queryCoursewares(params) {
  return request(`/api/coursewares?${stringify(params)}`);
}

export async function updateMaterial({ id, ...rest }) {
  return request(`/api/materials/${id}`, {
    method: 'PUT',
    body: rest,
  });
}

export async function updateCourseware({ id, ...rest }) {
  return request(`/api/coursewares/${id}`, {
    method: 'PUT',
    body: rest,
  });
}

export async function deleteMaterial({ id }) {
  return request(`/api/materials/${id}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'DELETE',
  });
}

export async function deleteCourseware({ id }) {
  return request(`/api/coursewares/${id}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'DELETE',
  });
}

export async function addMaterial(params) {
  return request('/api/materials', {
    method: 'POST',
    body: params,
  });
}

export async function queryMaterialDetail(params) {
  return request(`/api/materials/${params.id}`);
}

export async function queryCoursewareDetail(params) {
  return request(`/api/coursewares/${params.id}`);
}
