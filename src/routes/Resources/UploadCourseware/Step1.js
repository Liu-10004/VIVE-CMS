import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Icon, Card, Cascader, Upload, Select, message } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { validateTagLength, validateThumbnails } from 'utils/utils';
import courses from 'enums/courses';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ courseware, loading }) => ({
  courseware,
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
export default class Step1 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewImage: '',
      fileList: [],
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { thumbnails, tags } = values;
        const isTagMaxLength = validateTagLength(tags, 10);
        const isThumbnails = validateThumbnails(thumbnails.fileList, 4, 1024 * 1024);
        if (!isTagMaxLength) {
          message.warning(`标签字数不超过10个字，请检查标签字数.`);
        }
        if (!isThumbnails) {
          message.warning(`至少上传4张缩略图，大小不得超过1M，请检查缩略图大小及个数。`);
        }
        if (isTagMaxLength && isThumbnails) {
          const courseware = {
            ...values,
            category: values.category.toString(),
            tags: values.tags.toString(),
            label: values.label.toString(),
          };
          dispatch({
            type: 'courseware/add',
            payload: courseware,
          })
            .then(data => {
              if (data) {
                return dispatch({
                  type: 'courseware/update',
                  payload: data,
                });
              }
            })
            .then(response => {
              if (response && response.message === 'success') {
                dispatch(routerRedux.push('/resources/upload-courseware/step2'));
              }
            })
            .catch(error => {
              // eslint-disable-next-line no-console
              console.error('request failed: ', error);
            });
        }
      }
    });
  };

  beforeUpload = () => {
    return false;
  };

  handlePreview = file => {
    this.setState({
      previewImage: file.url,
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  render() {
    const { submitting, form } = this.props;
    const { previewImage, fileList } = this.state;
    const { getFieldDecorator } = form;

    const upLoadProps = {
      name: 'thumbnail',
      action: '',
      accept: 'image/jpeg, image/png',
      listType: 'picture-card',
      fileList,
      beforeUpload: this.beforeUpload,
      onPreview: this.handlePreview,
      onChange: this.handleChange,
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="课件名称" help="不超过20个汉字">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '请输入课件名称',
                  },
                ],
              })(<Input maxLength={20} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="分类">
              {getFieldDecorator('category', {
                rules: [
                  {
                    required: true,
                    message: '请选择类别',
                  },
                ],
                initialValue: ['义务教育', '科学', '物质科学'],
              })(<Cascader options={courses} style={{ width: '100%' }} placeholder="请选择分类" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="年级 / 专业">
              {getFieldDecorator('label', {
                rules: [
                  {
                    required: true,
                    message: '请输入年级 / 专业',
                  },
                ],
              })(<Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',']} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="合作单位" help="不超过20个汉字">
              {getFieldDecorator('organization', {
                rules: [
                  {
                    required: true,
                    message: '请输入合作单位',
                  },
                ],
              })(<Input maxLength={20} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="标签"
              help="标签字数不超过10个字，最多不超过7个标签，以逗号分隔"
            >
              {getFieldDecorator('tags', {
                rules: [
                  {
                    required: true,
                    message: '请输入标签',
                  },
                ],
              })(
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  maxTagCount={7}
                  tokenSeparators={[',']}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="课程介绍" help="不超过200个汉字">
              {getFieldDecorator('summary', {
                rules: [
                  {
                    required: true,
                    message: '请输入课程介绍',
                  },
                ],
              })(<TextArea style={{ minHeight: 32 }} rows={4} maxLength={200} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="缩略图" help="至少上传4张缩略图，大小不得超过1M.">
              {getFieldDecorator('thumbnails', {
                rules: [
                  {
                    required: true,
                    message: '请选择缩略图',
                  },
                ],
              })(
                <Upload {...upLoadProps}>
                  {fileList.length >= 4 ? null : previewImage ? (
                    <img src={previewImage} alt="thumbnail" />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                上传
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
