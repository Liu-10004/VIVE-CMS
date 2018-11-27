import React, { Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { stringify, parse } from 'qs';
import { routerRedux } from 'dva/router';
import { Tabs, Divider, Button, Popconfirm, DatePicker, Input, Table, Row, Col } from 'antd';
import { formatDate } from 'utils/time';
import { getRoutePath, parsePath } from 'utils/utils';
import { parsedStatus as parsedResourceStatus } from 'enums/ResourceStatus';
import { collectedCategories } from 'enums/ResourceCategory';
import ResourceFilter from 'components/ResourceManager/ResourceFilter';
import styles from './Resources.less';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Search } = Input;

const PAGE_SIZE = 20;
const ROLE = 0;
const adminMenuData = ['全部发布', '我审核', '未通过', '已下架'];
const personalMenuData = ['已发布', '待审核', '未通过', '已下架'];
const parsedCategories = collectedCategories.reduce(
  (previous, current) => ({ ...previous, [current.name]: current }),
  {}
);

@connect(({ statistic, material, courseware }) => ({
  statistic,
  material,
  courseware,
  global,
}))
class ResourceList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: '',
    };

    this.columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
      },
      {
        title: '缩略图',
        dataIndex: 'thumbnail',
        key: 'thumbnail',
        align: 'center',
        render: (_, { thumbnails, name }) => (
          <img style={{ width: 150, height: 80 }} src={thumbnails[0]} alt={name} />
        ),
      },
      {
        title: '名称',
        dataIndex: 'title',
        key: 'title',
        align: 'center',
      },
      {
        title: '类型',
        dataIndex: 'category',
        key: 'category',
        render: (_, record) => record.category && record.category[0],
      },
      {
        title: '上传时间',
        dataIndex: 'date',
        key: 'date',
        align: 'center',
        render: (_, record) => formatDate(record.date, '.'),
      },
    ];
  }

  componentWillMount() {
    const {
      location: { pathname, search },
      dispatch,
    } = this.props;
    const { isAdmin } = parsePath(pathname);
    const query = parse(search, { ignoreQueryPrefix: true });
    const nextQuery = 'page' in query ? { ...query } : { page: 0, ...query };

    if (query.keyword) this.setState({ keyword: query.keyword });

    // 页面初次渲染时，需要手动 push page=0 到路由
    dispatch(
      routerRedux.push({
        pathname,
        search: stringify(nextQuery),
      })
    );

    // 获取 status count 数据
    dispatch({
      type: 'statistic/fetchResourceStatus',
      payload: isAdmin ? { role: ROLE } : { role: null },
    });

    this.fetchData(pathname, nextQuery);
  }

  componentWillReceiveProps({ location: nextLocation }) {
    const {
      location: { pathname, search },
    } = this.props;
    const { pathname: nextPathname, search: nextSearch } = nextLocation;

    // 避免页面初次加载时进行 push page=0 到路由的操作引起重复请求数据，所以需要将 '?page=0' 过滤出去
    if (pathname === nextPathname && search === nextSearch) return;

    this.fetchData(nextPathname, nextSearch);
  }

  // 操作资源
  operateResource = (id, operate) => {
    const {
      dispatch,
      location: { pathname },
    } = this.props;
    const { isAdmin, type } = parsePath(pathname);
    const category = parsedCategories[type].parent;

    dispatch({
      type: `${category}/${operate}`,
      payload: operate === 'update' ? { id, status: 4 } : { id },
    }).then(response => {
      if (response.message === 'success') {
        dispatch({
          type: 'statistic/fetchResourceStatus',
          payload: isAdmin ? { role: ROLE } : { role: null },
        });
      }
    });
  };

  // Tab 发生改变时, 更新路由
  onStatusChange = status => {
    const {
      dispatch,
      location: { pathname },
    } = this.props;
    const splitPath = pathname.split('/');
    const basePath = `/${splitPath[1]}/${splitPath[2]}`;

    // 清空 keyword
    this.setState({ keyword: '' });

    dispatch(
      routerRedux.push({
        pathname: getRoutePath(basePath, status),
        search: stringify({ page: 0 }), // 默认加载第一页
      })
    );
  };

  // 筛选资源类型或状态时, 更新路由
  handleSelect = category => {
    const {
      dispatch,
      location: { pathname },
    } = this.props;
    const splitPath = pathname.split('/');
    const type = category.name;

    const nextPathname = `/${splitPath[1]}/${splitPath[2]}/${splitPath[3]}/${type}`;

    // 清空 keyword
    this.setState({ keyword: '' });

    dispatch(
      routerRedux.push({
        pathname: nextPathname,
        search: stringify({ page: 0 }), // 默认加载第一页
      })
    );
  };

  onInputChange = e => {
    this.setState({ keyword: e.target.value });
  };

  onSearch = value => {
    const {
      location: { pathname, search },
      dispatch,
    } = this.props;
    const query = parse(search, { ignoreQueryPrefix: true });
    const nextQuery = { ...query, page: 0, keyword: value }; // 请求第一页

    if (!value) delete nextQuery.keyword;

    dispatch(routerRedux.push({ pathname, search: stringify(nextQuery) }));
  };

  onDateChange = date => {
    const {
      location: { pathname, search },
      dispatch,
    } = this.props;
    const query = parse(search, { ignoreQueryPrefix: true });
    let nextQuery = { ...query, page: 0 }; // 请求第一页

    if (!date.length && nextQuery.date) {
      delete nextQuery.date;
    } else {
      nextQuery = {
        ...nextQuery,
        date: `${moment.utc(date[0]).format()},${moment.utc(date[1].format())}`,
      };
    }

    dispatch(routerRedux.push({ pathname, search: stringify(nextQuery) }));
  };

  onPageChange = page => {
    const {
      location: { pathname, search },
      dispatch,
    } = this.props;
    const query = parse(search, { ignoreQueryPrefix: true });
    const nextQuery = { ...query, page: page - 1 };

    dispatch(routerRedux.push({ pathname, search: stringify(nextQuery) }));
  };

  fetchData = (path, query) => {
    const { dispatch } = this.props;
    const { isAdmin, status, type } = parsePath(path);
    const { date, keyword, page } = parse(query, { ignoreQueryPrefix: true });
    let payload = {
      status: parsedResourceStatus[status.toUpperCase()], // 获取资源状态码,
      page,
      pageSize: PAGE_SIZE,
    };

    if (keyword) {
      payload = { ...payload, keyword };
    }

    if (isAdmin) {
      payload = { ...payload, role: ROLE };
    }

    if (date) {
      let dateRange = date.split(',');

      dateRange = {
        start: `${formatDate(dateRange[0], '-')} 00:00:00`.replace(';', ''),
        end: `${formatDate(dateRange[1], '-')} 23:59:59`.replace(';', ''),
      };

      payload = { ...payload, ...dateRange };
    }

    if (type === 'courseware') {
      dispatch({
        type: 'courseware/fetch',
        payload,
      });
    } else {
      payload = { ...payload, type: parsedCategories[type].id };
      dispatch({
        type: 'material/fetch',
        payload,
      });
    }
  };

  getColumns = () => {
    const {
      dispatch,
      location: { pathname },
    } = this.props;
    const { status, type, isAdmin } = parsePath(pathname);
    const category = parsedCategories[type].parent;
    const basePath = isAdmin ? `/resources/all/${category}` : `/resources/mine/${category}`;
    let column;

    // eslint-disable-next-line default-case
    switch (status) {
      case 'published':
        column = [
          {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (_, record) => (
              <Fragment>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => dispatch(routerRedux.push(`${basePath}/${record.id}`))}
                >
                  查看
                </Button>
                <Divider type="vertical" />
                <Popconfirm
                  title="确定下架该内容吗？下架之后将不再显示！"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => this.operateResource(record.id, 'update')}
                >
                  <Button type="danger" size="small">
                    下架
                  </Button>
                </Popconfirm>
              </Fragment>
            ),
          },
        ];

        return this.columns.concat(column);

      case 'passing':
        column = isAdmin
          ? [
              {
                title: '上传账号',
                dataIndex: 'uploader',
                key: 'uploader',
                align: 'center',
              },
              {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                align: 'center',
                render: (_, record) => (
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => dispatch(routerRedux.push(`${basePath}/verify/${record.id}`))}
                  >
                    审批
                  </Button>
                ),
              },
            ]
          : [
              {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                align: 'center',
                render: (_, record) => (
                  <Fragment>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => dispatch(routerRedux.push(`${basePath}/edit/${record.id}`))}
                    >
                      修改
                    </Button>
                    <Divider type="vertical" />
                    <Popconfirm
                      title="确定删除该内容吗？"
                      okText="确定"
                      cancelText="取消"
                      onConfirm={() => this.operateResource(record.id, 'delete')}
                    >
                      <Button type="danger" size="small">
                        删除
                      </Button>
                    </Popconfirm>
                  </Fragment>
                ),
              },
            ];

        return this.columns.concat(column);

      case 'unpassed':
        column = [
          {
            title: '未通过原因',
            dataIndex: 'reason',
            key: 'reason',
            align: 'center',
          },
          {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (_, record) =>
              isAdmin ? (
                <Button
                  type="primary"
                  size="small"
                  onClick={() => dispatch(routerRedux.push(`${basePath}/edit/${record.id}`))}
                >
                  修改
                </Button>
              ) : (
                <Fragment>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => dispatch(routerRedux.push(`${basePath}/edit/${record.id}`))}
                  >
                    修改
                  </Button>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="确定删除该内容吗？"
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => this.operateResource(record.id, 'delete')}
                  >
                    <Button type="danger" size="small">
                      删除
                    </Button>
                  </Popconfirm>
                </Fragment>
              ),
          },
        ];

        return this.columns.concat(column);

      case 'pulled':
        column = [
          {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (_, record) => (
              <Popconfirm
                title="确定删除该记录吗？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => this.operateResource(record.id, 'delete')}
              >
                <Button type="danger" size="small">
                  删除
                </Button>
              </Popconfirm>
            ),
          },
        ];

        return this.columns.concat(column);
    }
  };

  render() {
    const {
      statistic: { count },
      material,
      courseware,
      location: { search, pathname },
    } = this.props;
    const { keyword } = this.state;
    const { type, status, isAdmin } = parsePath(pathname);

    const { date } = parse(search, { ignoreQueryPrefix: true });
    const columns = this.getColumns();

    // 日期筛选
    const dateRange = date ? [moment(date.split(',')[0]), moment(date.split(',')[1])] : [];

    // 资源类型
    const categories =
      status === 'passing' || status === 'unpassed'
        ? collectedCategories.slice(1, 2)
        : collectedCategories;

    // 数据源
    const dataSource =
      parsedCategories[type].parent === 'material' ? material.data : courseware.data;
    const pagesData =
      parsedCategories[type].parent === 'material' ? material.pages : courseware.pages;

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
        <Tabs activeKey={status} animated={false} onChange={this.onStatusChange}>
          {Object.keys(count).map((resourceStatus, index) => {
            const tabName = isAdmin ? `${adminMenuData[index]}` : `${personalMenuData[index]}`;

            return (
              <TabPane
                key={resourceStatus.toLowerCase()}
                // TODO Show status count
                tab={tabName}
              />
            );
          })}
        </Tabs>
        <ResourceFilter categories={categories} currentType={type} onSelect={this.handleSelect} />
        <div>
          <Row type="flex" align="middle" justify="space-between" className={styles.selection}>
            <Col offset={1}>
              选择日期：
              <RangePicker
                disabledDate={current => current && current > moment().endOf('day')}
                value={dateRange}
                onChange={this.onDateChange}
              />
            </Col>
            <Col pull={1}>
              <Search
                style={{ width: 250 }}
                placeholder="请输入作品标题"
                value={keyword}
                onChange={this.onInputChange}
                onSearch={this.onSearch}
              />
            </Col>
          </Row>
          <Table
            rowKey={record => record.id}
            columns={columns}
            dataSource={dataSource}
            pagination={pagination}
          />
        </div>
      </div>
    );
  }
}

export default ResourceList;
