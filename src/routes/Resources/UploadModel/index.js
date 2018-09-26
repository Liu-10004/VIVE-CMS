import React, { PureComponent, Fragment } from 'react';
import { Route, Redirect, Switch } from 'dva/router';
import { Card, Steps } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { getRoutes } from 'utils/utils';
import styles from '../style.less';

const { Step } = Steps;

export default class StepForm extends PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const pathList = location.pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'step1':
        return 0;
      case 'step2':
        return 1;
      case 'result':
        return 2;
      default:
        return 0;
    }
  }

  render() {
    const { match, routerData, location } = this.props;
    return (
      <PageHeaderLayout tabActiveKey={location.pathname}>
        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="上传模型和缩略图" />
              <Step title="填写模型信息" />
              <Step title="上传成功，等待审核" />
            </Steps>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect exact from="/resources/upload-model" to="/resources/upload-model/step1" />
            </Switch>
          </Fragment>
        </Card>
      </PageHeaderLayout>
    );
  }
}
