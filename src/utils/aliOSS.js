const oss = require('ali-oss');

// 文件类型资源的上传
async function upload({ file, token }) {
  const { accessKeyId, accessKeySecret, bucket, key, region, securityToken } = token;
  const client = oss({
    region,
    accessKeyId,
    accessKeySecret,
    bucket,
    stsToken: securityToken,
  });

  try {
    let uploadResult = null;
    let progress = null;

    // 对于大于 100MB 的文件，采用分片上传
    if (file.size >= 1024 * 1024 * 100) {
      uploadResult = await client.multipartUpload(`${key}${file.name}`, file, {
        partSize: 1024 * 1024 * 2,
        progress: async percentage => {
          progress = percentage;
        },
      });
    } else {
      uploadResult = await client.put(`${key}${file.name}`, file);
    }

    // eslint-disable-next-line prefer-destructuring
    const status = uploadResult.res.status;
    // eslint-disable-next-line prefer-destructuring
    const fileUrl = uploadResult.res.requestUrls[0].split('?')[0]; // 获取上传之后的文件路径

    return { progress, fileUrl, status, message: 'success' };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('upload file to aliOSS failed: ', error);
    return { message: 'error' };
  }
}

export { upload };
