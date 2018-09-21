import React, { Fragment } from 'react';
import { Link } from 'dva/router';
import { Button, Card } from 'antd';
import Result from 'components/Result';
import PageHeaderLayout from 'layouts/PageHeaderLayout';

const actions = (
  <Fragment>
    <Button type="primary" size="large">
      <Link to="/resources/upload-courseware">继续上传</Link>
    </Button>
    <Button type="danger" size="large">
      <Link to="/resources/mine">返回</Link>
    </Button>
  </Fragment>
);

export default () => (
  <PageHeaderLayout>
    <Card bordered={false}>
      <Result
        type="success"
        title="上传成功"
        actions={actions}
        style={{ marginTop: 48, marginBottom: 16 }}
      />
    </Card>
  </PageHeaderLayout>
);
