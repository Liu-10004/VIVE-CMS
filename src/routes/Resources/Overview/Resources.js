import React from 'react';
import { connect } from 'dva';
import cx from 'classnames';
import { stringify, parse } from 'qs';
import { routerRedux } from 'dva/router';
import { Button, Table } from 'antd';
import { formatDate } from 'utils/time';
import styles from './Resources.less';

const PAGE_SIZE = 20;

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
    title: '审核',
    path: 'passing',
  },
};

const basePath = '/schools';

@connect(({ courseware }) => ({
  courseware,
  global,
}))
class ResourceList extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        title: '',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
      },
      {
        title: '报名时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        render: (_, record) => formatDate(record.createTime, '-'),
      },
      {
        title: '学校名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '院系/专业',
        dataIndex: 'dept',
        key: 'dept',
      },
      {
        title: '负责老师姓名',
        dataIndex: 'teacher',
        key: 'teacher',
        align: 'center',
      },
      {
        title: '职务',
        dataIndex: 'job',
        key: 'job',
        align: 'center',
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
        key: 'phone',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (_, record) => {
          return (
            <Button
              type="primary"
              className={cx(styles.btn, [styles[`${STATUS[record.status].path}`]])}
              size="small"
              onClick={() => {
                localStorage.setItem('currentPage', props.location.search);

                return props.dispatch(
                  routerRedux.push({
                    pathname: `${basePath}/verify/${record.userId}`,
                  })
                );
              }}
            >
              {`${STATUS[record.status].title}`}
            </Button>
          );
        },
      },
    ];
  }

  componentWillMount() {
    const {
      location: { pathname, search },
      dispatch,
    } = this.props;
    const query = parse(search, { ignoreQueryPrefix: true });
    const nextQuery = 'page' in query ? { ...query } : { page: 0, ...query };

    // 页面初次渲染时，需要手动 push page=0 到路由
    dispatch(
      routerRedux.push({
        pathname,
        search: stringify(nextQuery),
      })
    );

    this.fetchData(nextQuery);
  }

  componentWillReceiveProps({ location: nextLocation }) {
    const {
      location: { pathname, search },
    } = this.props;
    const { pathname: nextPathname, search: nextSearch } = nextLocation;

    // 避免页面初次加载时进行 push page=0 到路由的操作引起重复请求数据，所以需要将 '?page=0' 过滤出去
    if (pathname === nextPathname && search === nextSearch) {
      console.log('componentWillReceiveProps: ');
      return;
    }

    this.fetchData(nextSearch);
  }

  onPageChange = page => {
    const {
      location: { pathname, search },
      dispatch,
    } = this.props;
    const query = parse(search, { ignoreQueryPrefix: true });
    const nextQuery = { ...query, page: page - 1 };

    dispatch(routerRedux.push({ pathname, search: stringify(nextQuery) }));
  };

  fetchData = query => {
    const { dispatch } = this.props;
    const { page } = parse(query, { ignoreQueryPrefix: true });
    const payload = {
      page,
      pageSize: PAGE_SIZE,
    };

    dispatch({
      type: 'courseware/fetch',
      payload,
    });
  };

  exportExcel = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'courseware/export',
    });
  };

  render() {
    const { courseware } = this.props;

    const columns = this.columns;

    // 数据源
    const dataSource = courseware.data;
    const pagesData = courseware.pages;

    // 分页器数据
    const pagination = {
      showQuickJumper: true,
      current: parseInt(pagesData.number, 10) + 1, // 转为 number 类型
      pageSize: pagesData.size,
      total: pagesData.totalElements,
      onChange: this.onPageChange,
    };

    return (
      <div>
        <div className={styles.panel}>
          <span>
            总计：
            {pagesData.totalElements} 个
          </span>
          <Button type="primary" onClick={this.exportExcel}>
            导出 Excel 表格
          </Button>
        </div>
        <Table
          rowKey={record => record.id}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
        />
      </div>
    );
  }
}

export default ResourceList;
