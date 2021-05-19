import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, message, Breadcrumb } from 'antd';
import { FormCard, SchoolCard, MemberCard } from 'components/Form';
import { routerRedux } from 'dva/router';
import { parse } from 'qs';
import styles from './VerifyMaterial.less';

message.config({
  maxCount: 1,
});

const STATUS = {
  0: {
    key: 0,
    title: '未通过审核',
    path: 'unpassed',
  },
  1: {
    key: 1,
    title: '已通过审核',
    path: 'passed',
  },
  2: {
    key: 2,
    title: '审核中',
    path: 'passing',
  },
};
const PAGE_SIZE = 20;
const BreadcrumbStr = ['报名信息'];

@Form.create()
class VerifyMaterial extends React.PureComponent {
  state = {
    reason: '',
    version: 0,
    passed: false,
    next: false,
  };

  componentWillMount() {
    const {
      courseware: { data },
    } = this.props;

    if (data.length === 0) {
      this.fetchData();
    }

    this.fetchDetails();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      passed: nextProps.courseware.details[0] && nextProps.courseware.details[0].status === 1,
    });
  }

  fetchData = () => {
    const { dispatch } = this.props;
    const currentPage = localStorage.getItem('currentPage');
    const { page } = parse(currentPage, { ignoreQueryPrefix: true });
    const payload = {
      page,
      pageSize: PAGE_SIZE,
    };

    dispatch({
      type: 'courseware/fetch',
      payload,
    });
  };

  fetchDetails(userId) {
    const {
      dispatch,
      location: { pathname },
    } = this.props;

    return dispatch({
      type: 'courseware/fetchDetail',
      payload: { userId: userId || pathname.split('/').slice(-1)[0] },
    });
  }

  onValidateForm = (type, detail) => {
    const { dispatch, courseware } = this.props;
    const { nextId } = courseware;
    const { reason } = this.state;
    const values = { id: detail.id };

    if (type === 'unpass') {
      if (!reason || !reason.trim()) {
        return message.warn('请输入不通过的理由');
      }
      Object.assign(values, { reason, status: 0 });
    } else {
      Object.assign(values, { status: 1 });
    }

    dispatch({
      type: 'courseware/update',
      payload: values,
    })
      .then(() => {
        this.setState({ passed: true });
        if (nextId) {
          this.setState({ version: 0, reason: '', next: true });
          this.fetchData(nextId).then(() => {
            dispatch(routerRedux.push(`/schools/verify/${nextId}`));
          });
        } else {
          this.setState({ next: true });
        }
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  };

  render() {
    const { history, courseware } = this.props;
    const { details = [] } = courseware;

    if (details.length === 0) return <p className={styles.loading}>加载数据中...</p>;

    const { next, passed, reason, version } = this.state;
    const detail = details[version];
    const { members } = detail;

    return (
      <div>
        <div className={styles.breadcrumb}>{`${BreadcrumbStr}/${STATUS[detail.status].title}`}</div>
        <div className={styles.formPage}>
          {detail.status === 0 && (
            <div className={styles.panel}>
              未通过审核原因
              <p>{detail.reason}</p>
            </div>
          )}
          <div className={styles.form}>
            <FormCard title="学校信息">
              <SchoolCard data={detail} />
            </FormCard>
            <FormCard
              title="团队成员信息"
              tips="（团队总人数至少2名但不超过5名。其中，最多2名的参赛教师中必须有1名为指导教师）"
            >
              {members.map((member, idx) => (
                <MemberCard key={member.identityNum + idx} index={idx} data={member} />
              ))}
            </FormCard>
          </div>
          {details.length > 1 && (
            <div className={styles.version}>
              {details.map((_, index) => (
                <Button
                  key={`button${index}`}
                  type={version === index ? 'primary' : undefined}
                  onClick={() => this.setState({ version: index })}
                >
                  {index === 0 ? '最新版本' : `历史版本 ${index}`}{' '}
                </Button>
              ))}
            </div>
          )}
          <div className={styles.verify}>
            {/* 审核不通过或未审核的最新版本支持审核 */}
            <div className={styles.content}>
              {!passed &&
                version === 0 && (
                  <Fragment>
                    <Button
                      type="primary"
                      key="primary"
                      onClick={() => this.onValidateForm('pass', detail)}
                    >
                      通过
                    </Button>
                    <Input
                      style={{ marginLeft: '45px', width: '300px' }}
                      placeholder="请填写不通过的理由"
                      maxLength={40}
                      value={reason}
                      onChange={e => this.setState({ reason: e.target.value })}
                    />
                    <Button
                      type="primary"
                      onClick={() => this.onValidateForm('unpass', detail)}
                      className={styles.fall}
                    >
                      不通过
                    </Button>
                  </Fragment>
                )}
            </div>
            {next && (
              <span className={styles.tips}>当前页已审核结束，请返回列表进行下一页的审核</span>
            )}
            <Button type="primary" onClick={() => history.goBack()}>
              返回
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ courseware }) => ({
  courseware,
}))(VerifyMaterial);
