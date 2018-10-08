import React from 'react';
import { Table, Button } from 'antd';

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
  },
  {
    title: '学科',
    dataIndex: 'category',
    render: (_, record) => record.category && record.category[1],
  },
  {
    title: '课件名称',
    dataIndex: 'title',
  },
];

class CoursewareList extends React.Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  onSelected = () => {
    const { handleSelected } = this.props;
    const { selectedRowKeys } = this.state;
    handleSelected(selectedRowKeys);
    this.setState({
      selectedRowKeys: [],
    });
  };

  render() {
    const { data, pages, onPageChange } = this.props;
    const { number, totalElements } = pages;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    // 分页器数据
    const pagination = {
      current: parseInt(number, 10) + 1, // 转为 number 类型
      total: totalElements,
      onChange: onPageChange,
    };

    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this.onSelected} disabled={!hasSelected}>
            确认选择
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `已选择了 ${selectedRowKeys.length} 个课件` : ''}
          </span>
        </div>
        <Table
          rowKey={record => record}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={pagination}
        />
      </div>
    );
  }
}

export default CoursewareList;
