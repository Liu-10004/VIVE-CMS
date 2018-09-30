import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Icon, Card, Cascader, Upload, Select, message } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { validateTagLength, validateThumbnails, filterArraySpace } from 'utils/utils';
import { coursewares } from 'enums/ResourceOptions';

message.config({
  maxCount: 1,
});

const FormItem = Form.Item;
const { TextArea } = Input;

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

@connect(({ courseware }) => ({
  courseware,
}))
@Form.create()
export default class Step1 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewImage: '',
      fileList: [],
      loading: false,
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { title, category, thumbnails, tags, label } = values;

        const filtertags = filterArraySpace(tags);
        const isThumbnails = validateThumbnails(thumbnails.fileList, 4, 1024 * 1024);

        if (!title.trim()) return message.warning(`标题不符合要求`);
        if (!label.trim()) return message.warning(`年级 / 专业不符合要求`);
        if (!validateTagLength(filtertags, 10) || !filtertags.length || filtertags.length > 7)
          return message.warning(`标签不符合上传要求`);
        if (!isThumbnails) return message.warning(`请检查缩略图大小及个数。`);

        // 显示按钮的加载中状态
        this.setState({ loading: true });

        const courseware = {
          ...values,
          title: title.trim(),
          category: category.toString(),
          tags: filtertags.toString(),
          label: label.trim(),
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
    const { form } = this.props;
    const { previewImage, fileList, loading } = this.state;
    const { getFieldDecorator } = form;

    const upLoadProps = {
      name: 'thumbnail',
      action: '',
      accept: 'image/jpeg, image/png',
      listType: 'picture-card',
      fileList,
      multiple: true,
      showUploadList: { showPreviewIcon: false },
      beforeUpload: this.beforeUpload,
      onPreview: this.handlePreview,
      onChange: this.handleChange,
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
            <FormItem {...formItemLayout} label="课件名称" help="不超过 20 个汉字">
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
              })(
                <Cascader
                  options={coursewares}
                  style={{ width: '100%' }}
                  placeholder="请选择分类"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="年级 / 专业" help="不超过 20 个汉字">
              {getFieldDecorator('label', {
                rules: [
                  {
                    required: true,
                    message: '请输入年级 / 专业',
                  },
                ],
              })(<Input maxLength={20} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="合作单位" help="不超过 20 个汉字">
              {getFieldDecorator('organization', {
                rules: [
                  {
                    message: '请输入合作单位',
                  },
                ],
              })(<Input maxLength={20} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="标签"
              help="标签不能为空标签，字数不超过 10 个字，最多不超过 7 个标签，以逗号分隔"
            >
              {getFieldDecorator('tags', {
                rules: [
                  {
                    required: true,
                    message: '请输入标签',
                  },
                ],
              })(<Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',', '，']} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="课程介绍" help="不超过 200 个汉字">
              {getFieldDecorator('summary', {
                rules: [
                  {
                    required: true,
                    message: '请输入课程介绍',
                  },
                ],
              })(<TextArea style={{ minHeight: 32 }} rows={4} maxLength={200} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="缩略图" help="上传 4 张缩略图，大小不得超过 1MB">
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
              <Button type="primary" icon="cloud" htmlType="submit" loading={loading}>
                上传
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
