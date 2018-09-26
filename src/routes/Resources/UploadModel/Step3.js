import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import { routerRedux } from 'dva/router';
import Result from 'components/Result';
import styles from './style.less';

class Step3 extends React.PureComponent {
  render() {
    const { dispatch } = this.props;
    const onFinish = () => {
      dispatch({
        type: 'material/saveUploadFiles',
        payload: {},
      });
      dispatch(routerRedux.push('/resources/upload-model'));
    };
    const actions = (
      <Fragment>
        <Button type="primary" onClick={onFinish}>
          继续上传
        </Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="上传成功，等待审核"
        actions={actions}
        className={styles.result}
      />
    );
  }
}

export default connect()(Step3);
