/**
 * 格式化秒为时分秒，小于10的将自动补0
 * @param  {string} duration 单位为s
 * @return {string} 时分秒，即 hh：mm: ss
 */
export const formatDuration = duration => {
  let hours = parseInt(duration / 3600, 10);
  let minutes = parseInt((duration % 3600) / 60, 10);
  let seconds = parseInt((duration % 3600) % 60, 10);

  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
};

/**
 * 将时间格式化为 format 指定的日期格式
 *
 * @param {string} timeInMilliseconds UTC 格式的时间
 * @param {number} format 指定需要返回的日期格式, 默认返回 xxx年xx月xx日
 *
 * @return 返回 format 指定格式的日期
 */
export const formatDate = (timeInMilliseconds, format) => {
  const date = new Date(timeInMilliseconds);

  // 不能用 ”===“， 因为类型不一样
  // eslint-disable-next-line eqeqeq
  if (date == 'Invalid Date') return 'Invalid Date';

  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);

  if (format) {
    return `${year}${format}${month}${format}${day}`;
  } else {
    return `${year}年${month}月${day}日`;
  }
};

export default { formatDuration, formatDate };
