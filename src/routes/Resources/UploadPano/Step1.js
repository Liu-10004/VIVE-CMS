import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Form,
  Input,
  Button,
  Icon,
  Card,
  Cascader,
  Upload,
  Select,
  Radio,
  message,
  Modal,
  Tag,
} from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import CoursewareList from 'components/CoursewareTable';
import { validateTagLength, validateThumbnails, filterArraySpace } from 'utils/utils';
import { panoramas } from 'enums/ResourceOptions';

message.config({
  maxCount: 1,
});

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Dragger } = Upload;

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
  coursewareData: courseware.data,
}))
@Form.create()
export default class Step1 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewImage: '',
      fileList: [],
      modelVisible: false,
      coursewareIDs: [],
      loading: false,
      resourceType: '全景图片',
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { coursewareIDs } = this.state;
        const {
          thumbnails: { fileList: thumbnailList },
          file: { fileList },
          title,
          tags,
          category,
        } = values;

        const filtertags = filterArraySpace(tags);
        const isThumbnails = validateThumbnails(thumbnailList, 1, 1024 * 1024 * 1);
        const isFile = validateThumbnails(fileList, 1, 1024 * 1024 * 1024);

        if (!title.trim()) return message.warning(`标题不符合上传要求`);
        if (!validateTagLength(filtertags, 6) || !filtertags.length || filtertags.length > 7)
          return message.warning(`标签不符合上传要求`);
        if (!isThumbnails || !isFile) return message.warning('文件或缩略图标签不符合上传要求');

        // 显示按钮的加载中状态
        this.setState({ loading: true });

        const { originFileObj: thumbnails } = thumbnailList[0];
        const { originFileObj: file } = fileList[0];
        const { name, size } = file;

        const panorama = {
          ...values,
          title: title.trim(),
          type: 2, // 资源的类型，1 是 model & scene，2 是 全景视频 & 全景图片
          format: name.split('.').slice(-1)[0],
          category: category.toString(),
          tags: filtertags.toString(),
          coursewareIDs: !coursewareIDs.length ? null : coursewareIDs.toString(),
          size,
          thumbnails,
          file,
        };

        dispatch({
          type: 'material/addPano',
          payload: panorama,
        })
          .then(data => {
            if (data) {
              return dispatch({
                type: 'material/update',
                payload: data,
              });
            }
          })
          .then(response => {
            if (response && response.message === 'success') {
              dispatch(routerRedux.push('/resources/upload-pano/step2'));
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

  handleChange = ({ fileList }) => this.setState({ fileList });

  showModal = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'courseware/fetch',
      payload: { status: 1 },
    })
      .then(() => {
        this.setState({
          modelVisible: true,
        });
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('request failed: ', error);
      });
  };

  handleOk = () => {
    this.setState({
      modelVisible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      modelVisible: false,
    });
  };

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
    });
  };

  handleCategoryChange = value => {
    this.setState({
      resourceType: value[0],
    });
  };

  handleSelectedData = data => {
    this.handleCancel();
    this.setState({
      coursewareIDs: data,
    });
  };

  render() {
    const { form, coursewareData } = this.props;
    const {
      previewImage,
      fileList,
      modelVisible,
      coursewareIDs,
      loading,
      resourceType,
    } = this.state;
    const { getFieldDecorator } = form;

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

    const uploadProps = {
      name: 'thumbnails',
      action: '',
      accept: 'image/jpeg, image/png',
      listType: 'picture-card',
      fileList,
      showUploadList: { showPreviewIcon: false },
      beforeUpload: this.beforeUpload,
      onChange: this.handleChange,
      onPreview: this.handlePreview,
    };

    const uploadDraggerProps = {
      name: 'file',
      action: '',
      accept:
        resourceType === '全景图片'
          ? 'image/psd, image/tiff, image/jpeg, image/x-tga, image/png, image/gif, image/bmp, image/iff, image/x-iff, image/pict'
          : 'video/mp4, video/mpeg, video/x-msvideo, video/x-ms-asf',
      beforeUpload: this.beforeUpload,
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
            <FormItem {...formItemLayout} label="名称" help="不超过 14 个汉字">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '请输入名称',
                  },
                ],
              })(<Input maxLength={14} />)}
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
                  options={panoramas}
                  style={{ width: '100%' }}
                  placeholder="请选择分类"
                  onChange={this.handleCategoryChange}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="级别">
              {getFieldDecorator('level', {
                rules: [
                  {
                    required: true,
                    message: '请选择素材级别',
                  },
                ],
              })(
                <RadioGroup name="radiogroup">
                  <Radio value="1">精品</Radio>
                  <Radio value="0" disabled>
                    普通
                  </Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="所属课件">
              {coursewares}
              <Tag onClick={this.showModal} style={{ background: '#fff', borderStyle: 'dashed' }}>
                <Icon type="plus" /> 选择课件
              </Tag>
              <Modal
                visible={modelVisible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={null}
              >
                <CoursewareList handleSelected={this.handleSelectedData} data={coursewareData} />
              </Modal>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="标签"
              help="标签中不能含有空格，字数不超过 6 个字，最多不超过 7 个标签，以逗号分隔"
            >
              {getFieldDecorator('tags', {
                rules: [
                  {
                    required: true,
                    message: '请输入标签',
                  },
                ],
              })(<Select mode="tags" style={{ width: '100%' }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="缩略图" help="上传一张缩略图，大小不超过 1MB">
              {getFieldDecorator('thumbnails', {
                rules: [
                  {
                    required: true,
                    message: '请选择缩略图',
                  },
                ],
              })(
                <Upload {...uploadProps}>
                  {fileList.length >= 1 ? null : previewImage ? (
                    <img src={previewImage} alt="thumbnail" />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="VR 全景文件"
              help="上传一个 VR 全景文件，大小不超过 1GB"
            >
              {getFieldDecorator('file', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <Dragger {...uploadDraggerProps}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                </Dragger>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" icon="cloud" loading={loading} htmlType="submit">
                上传
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
