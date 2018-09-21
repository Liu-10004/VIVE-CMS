const status = {
  '1': 'PUBLISHED', // 发布
  '2': 'PASSING', // 审核
  '3': 'UNPASSED', // 未通过
  '4': 'PULLED', // 已下架
};

/**
 * 将 status key 与 value 值进行颠倒，从 {'1': 'PUBLISHED', ...} => {'PUBLISHED': '1', ...}
 *
 * @return {status} 反转之后的 status
 */
const parseStatus = () =>
  Object.keys(status).reduce(
    (previous, current) => ({ ...previous, [status[current]]: current }),
    {}
  );

const parsedStatus = parseStatus();

export { status, parsedStatus };
