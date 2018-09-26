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

  render() {
    const { data, handleSelected } = this.props;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            onClick={() => handleSelected(selectedRowKeys)}
            disabled={!hasSelected}
          >
            确认选择
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `已选择了 ${selectedRowKeys.length} 个课件` : ''}
          </span>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      </div>
    );
  }
}

export default CoursewareList;
