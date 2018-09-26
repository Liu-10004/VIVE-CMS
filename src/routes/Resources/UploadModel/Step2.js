import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider, Icon, Radio, Modal, Tag, Cascader } from 'antd';
import { routerRedux } from 'dva/router';
import CoursewareList from 'components/CoursewareTable';
import { models } from 'enums/ResourceOptions';
import styles from './style.less';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class Step2 extends React.PureComponent {
  state = { visible: false, coursewareTags: null };

  showModal = () => {
    const { dispatch } = this.props;
    this.setState({
      visible: true,
    });

    dispatch({
      type: 'courseware/fetch',
      payload: { status: 1 },
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSelectedData = data => {
    this.handleCancel();
    this.setState({
      coursewareTags: data,
    });
  };

  render() {
    const { form, dispatch, coursewareData, submitting } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const { coursewareTags, visible } = this.state;

    let coursewares;
    if (coursewareTags) {
      coursewares = coursewareTags.map(index => {
        return (
          <Tag closable key={index}>
            {coursewareData[index].title}
          </Tag>
        );
      });
    }

    // 选择所属课件的数据表格
    const tableData = [];
    for (let i = 0; i < coursewareData.length; i += 1) {
      tableData.push({
        key: i,
        index: i,
        category: coursewareData[i].category[1],
        title: coursewareData[i].title,
      });
    }

    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          const selectedCourseware = coursewareTags.map(tag => coursewareData[tag].id);

          Object.assign(
            values,
            { tags: values.tags.toString(), category: values.category.toString() },
            {
              coursewareIDs: selectedCourseware.toString(),
            },
            {
              type: 1,
            }
          );

          dispatch({
            type: 'material/addModel',
            payload: values,
          })
            .then(data => {
              return dispatch({
                type: 'material/update',
                payload: data,
              });
            })
            .then(() => {
              dispatch(routerRedux.push('/resources/upload-model/result'));
            })
            .catch(error => {
              // eslint-disable-next-line no-console
              console.log(error);
            });
        }
      });
    };
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm}>
          <Form.Item {...formItemLayout} label="标题">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请填写名称' }],
            })(<Input placeholder="请给模型起个名字" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="格式">
            {getFieldDecorator('format', {
              rules: [{ required: true, message: '请选择格式' }],
            })(
              <Radio.Group>
                <Radio value="fbx">fbx</Radio>
                <Radio value="abm">abm</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="级别">
            {getFieldDecorator('level', {
              rules: [{ required: true, message: '请选择级别' }],
            })(
              <Radio.Group>
                <Radio value={1}>精品</Radio>
                <Radio value={0}>普通</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="分类">
            {getFieldDecorator('category', {
              rules: [{ required: true, message: '请选择类别' }],
            })(<Cascader options={models} style={{ width: '100%' }} placeholder="请选择分类" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="所属课件">
            {coursewares}
            <Tag onClick={this.showModal} style={{ background: '#fff', borderStyle: 'dashed' }}>
              <Icon type="plus" /> 选择课件
            </Tag>
            <Modal
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={null}
            >
              <CoursewareList handleSelected={this.handleSelectedData} data={tableData} />
            </Modal>
          </Form.Item>
          <Form.Item {...formItemLayout} label="标签">
            {getFieldDecorator('tags', {
              rules: [{ required: true, message: '请给模型指定标签' }],
            })(
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="标签字数不超过6个字，最多4个标签"
                tokenSeparators={[',', '，']}
                maxTagCount={4}
              >
                <Option key="1" />
              </Select>
            )}
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 8 }}
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm} loading={submitting}>
              上传
            </Button>
          </Form.Item>
          <Divider style={{ margin: '40px 0 24px' }} />
        </Form>
      </Fragment>
    );
  }
}

export default connect(({ material, courseware, loading }) => ({
  submitting: loading.effects['material/update'],
  materialData: material,
  coursewareData: courseware.data,
}))(Step2);
