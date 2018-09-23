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

export { getStatus, getResources };
