import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  Select,
  Divider,
  Icon,
  Radio,
  Modal,
  Tag,
  Cascader,
  message,
} from 'antd';
import { routerRedux } from 'dva/router';
import CoursewareList from 'components/CoursewareTable';
import { models } from 'enums/ResourceOptions';
import { filterArraySpace, validateTagLength } from 'utils/utils';
import styles from './style.less';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

message.config({
  maxCount: 1,
});

@Form.create()
class Step2 extends React.PureComponent {
  state = { visible: false, coursewareIDs: [], loading: false };

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
      coursewareIDs: data,
    });
  };

  onPageChange = page => {
    const { dispatch } = this.props;
    dispatch({
      type: 'courseware/fetch',
      payload: { status: 1, page: page - 1 },
    });
  };

  onValidateForm = () => {
    const { form, dispatch, materialData } = this.props;
    const { validateFields } = form;
    const { coursewareIDs } = this.state;
    validateFields((err, values) => {
      if (!err) {
        const { title, tags, category } = values;
        const filterTags = filterArraySpace(tags);
        const tagsLength = filterTags.length;

        if (!title.trim()) {
          message.warn('标题不符合上传要求');
          return;
        }

        if (!validateTagLength(filterTags, 6) || tagsLength > 7 || !tagsLength) {
          message.warn('标签不符合上传要求');
          return;
        }

        if (!materialData.files && !materialData.thumbnails) {
          message.warn('请重新在第一步选择压缩包和缩略图');
          return;
        }

        Object.assign(
          values,
          {
            title: title.trim(),
          },
          { tags: filterTags.toString(), category: category.toString() },
          {
            coursewareIDs: !coursewareIDs.length ? null : coursewareIDs.toString(),
          },
          {
            type: 1,
          }
        );

        this.setState({
          loading: true,
        });

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
            this.setState({ loading: true });
            dispatch(routerRedux.push('/resources/upload-model/result'));
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.log(error);
          });
      }
    });
  };

  render() {
    const { form, courseware } = this.props;
    const { data: coursewareData, pages } = courseware;
    const { getFieldDecorator } = form;
    const { coursewareIDs, visible, loading } = this.state;

    let coursewares;
    if (coursewareIDs) {
      coursewares = coursewareIDs.map(id => {
        const index = coursewareIDs.indexOf(id);
        return (
          <Tag closable key={id}>
            {coursewareData[index].title}
          </Tag>
        );
      });
    }

    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm}>
          <Form.Item {...formItemLayout} label="标题" help="最多 14 个字">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请填写名称' }],
            })(<Input placeholder="请给模型起个名字" maxLength={14} />)}
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
              <CoursewareList
                handleSelected={this.handleSelectedData}
                onPageChange={this.onPageChange}
                data={coursewareData}
                pages={pages}
              />
            </Modal>
          </Form.Item>
          <Form.Item {...formItemLayout} label="标签" help="标签字数不超过 6 个字，最多 7 个标签">
            {getFieldDecorator('tags', {
              rules: [{ required: true, message: '请给模型指定标签' }],
            })(<Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',', '，']} />)}
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
            <Button type="primary" icon="cloud" onClick={this.onValidateForm} loading={loading}>
              上传
            </Button>
          </Form.Item>
          <Divider style={{ margin: '40px 0 24px' }} />
        </Form>
      </Fragment>
    );
  }
}

export default connect(({ material, courseware }) => ({
  materialData: material,
  courseware,
}))(Step2);
