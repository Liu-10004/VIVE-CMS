import { parse } from 'url';
import { status as Status } from '../src/enums/ResourceStatus';

const fakeStatus = (min = 100, max = 1000) =>
  Object.keys(Status).reduce(
    (previous, current) =>
      Object.assign(previous, { [Status[current]]: Math.floor(Math.random() * (max - min)) + min }),
    {}
  );

const fakeResource = ({ status }) => ({
  title: '一个素材',
  thumbnails: [
    'https://vivedu-courseware.oss-cn-beijing.aliyuncs.com/2c9281895d688ccb015d742a04720000/cover-cover.jpg?Expires=1536836217&OSSAccessKeyId=TMP.AQHAMfs3VYYsXPhP-3GXZgNoVfBx1aKAJCh_h2KOyEzJEzUYuJercZDrvefaAAAwLAIUCcR72JRpiythCW3w9U_iN5mneeUCFAkXyt6KFHOL1_STDw1ZreRobR0Q&Signature=njZU8M8w18RMt%2BZzBwKQm%2FncOAs%3D',
  ],
  category: ['场景'],
  date: 'Tue Sep 11 2018 16:28:08 GMT+0800 (中国标准时间)',
  uploader: status === 'PASSING' ? 'manager@vivedu.com' : undefined,
  reason: status === 'UNPASSED' ? '描述不对' : undefined,
});

const fakeMaterialDetail = ({ id }) => ({
  id,
  title: '一个素材',
  type: ['1', '2'][Math.floor(Math.random() * 2)],
  format: ['fbx', 'abm'][Math.floor(Math.random() * 2)],
  category: ['category1', 'category2', 'category3'],
  level: ['1', '2'][Math.floor(Math.random() * 2)],
  tags: ['tag1', 'tag2', 'tag3'],
  coursewares: ['语文课', '数学课', '品酒课'],
  video: '',
  thumbnails: [
    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  ],
});

const fakeCoursewareDetail = ({ id }) => ({
  id,
  title: '一个课件',
  format: ['fbx', 'abm'][Math.floor(Math.random() * 2)],
  category: ['category1', 'category2', 'category3'],
  label: ['三年级', '四年级', '五年级'],
  tags: ['tag1', 'tag2', 'tag3'],
  summary:
    '从我国古代的天圆地方到17世纪麦哲伦通过航海证实地球是圆的，再到地球的构成，为什么会出现火山爆发和地震等可怕的自然灾害，这一系列的未知与疑问都可以通过VR来解答，同学们将穿越从古至今的不同场景、体验古人与现代人对地球的认知，全方位了解我们赖以生存的地球——我们的母亲！',
  thumbnails: [
    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  ],
});

const resourceCount = fakeStatus();

const getResources = (req, res, u) => {
  const resourceList = [];
  let url = u;

  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;
  const pageSize = params.pageSize || 20;

  for (let i = 0; i < pageSize; i += 1) {
    const resource = Object.assign({}, { id: `resource${params.page}${i}` }, fakeResource(params));

    resourceList.push(resource);
  }

  const result = {
    message: 'success',
    data: {
      content: resourceList,
      size: parseInt(pageSize, 10),
      number: parseInt(params.page, 10),
      totalElements: resourceCount[Status[params.status]],
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
};

const getStatus = (_, res) => {
  const result = {
    message: 'success',
    data: Object.keys(resourceCount).map(key => ({ status: key, count: resourceCount[key] })),
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
};

const getMaterialDetail = (req, res) => {
  const { url } = req;

  const result = {
    message: 'success',
    data: fakeMaterialDetail(url.split('/').slice(-1)[0]),
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
};

const getCoursewareDetail = (req, res) => {
  const { url } = req;

  const result = {
    message: 'success',
    data: fakeCoursewareDetail(url.split('/').slice(-1)[0]),
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
};

export { getStatus, getResources, getCoursewareDetail, getMaterialDetail };
