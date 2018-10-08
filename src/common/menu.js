import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '内容云素材管理',
    icon: 'table',
    path: 'resources',
    children: [
      {
        name: '全部素材',
        path: 'all',
        authority: 'admin',
      },
      {
        name: '审核',
        path: 'all/material/verify/:id',
        hideInMenu: true,
      },
      {
        name: '素材详情',
        path: 'all/material/:id',
        hideInMenu: true,
      },
      {
        name: '课件详情',
        path: 'all/courseware/:id',
        hideInMenu: true,
      },
      {
        name: '我的素材',
        path: 'mine',
      },
      {
        name: '素材详情',
        path: 'mine/material/:id',
        hideInMenu: true,
      },
      {
        name: '课件详情',
        path: 'mine/courseware/:id',
        hideInMenu: true,
      },
      {
        name: '上传课件',
        path: 'upload-courseware',
      },
      {
        name: '上传模型 / 场景',
        path: 'upload-model',
      },
      {
        name: '上传 VR 全景',
        path: 'upload-pano',
      },
    ],
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: '登录',
        path: 'login',
      },
      {
        name: '注册',
        path: 'register',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
