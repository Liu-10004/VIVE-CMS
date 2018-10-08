import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  Select,
  Icon,
  Radio,
  Modal,
  Tag,
  Cascader,
  message,
  Upload,
} from 'antd';
import CoursewareList from 'components/CoursewareTable';
import { models } from 'enums/ResourceOptions';
import {
  filterArraySpace,
  validateTagLength,
  uniqueArray,
  validateFile,
  validateThumbnails,
} from 'utils/utils';
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
  constructor(props) {
    super(props);

    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      zipList: [],
      visible: false,
      coursewares: [],
      loading: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      location: { pathname },
    } = this.props;
    dispatch({
      type: 'material/fetchDetail',
      payload: { id: pathname.split('/').slice(-1)[0] },
    }).then(material => {
      const { data: materialDetail } = material;
      const { coursewares, thumbnails, file } = materialDetail;

      if (coursewares) {
        this.setState({
          coursewares: materialDetail.coursewares,
        });
      }

      const defaultThumbnails = thumbnails.map((thumbnail, index) => ({
        uid: index,
        name: thumbnail.split('/').slice(-1)[0],
        url: thumbnail,
      }));

      const defaultFiles = [{ uid: '-1', name: file }];

      if (thumbnails.length) {
        this.setState({
          fileList: defaultThumbnails,
          zipList: defaultFiles,
        });
      }
    });
  }

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleCoursewareModal = () => {
    this.setState({
      visible: true,
    });

    this.fetchCoursewares({});
  };

  handlePageChange = page => {
    this.fetchCoursewares({ page: page - 1 });
  };

  fetchCoursewares = payload => {
    const {
      dispatch,
      location: { pathname },
    } = this.props;
    const role = pathname.split('/')[2];
    if (role === 'all') {
      Object.assign(payload, { status: 1, role: 0 });
    } else {
      Object.assign(payload, { status: 1 });
    }

    dispatch({
      type: 'courseware/fetch',
      payload,
    });
  };

  handleCancel = type => {
    if (type === 'preview') {
      this.setState({
        previewVisible: false,
      });
    } else {
      this.setState({
        visible: false,
      });
    }
  };

  handleSelectedData = data => {
    const { coursewares } = this.state;
    this.handleCancel();
    this.setState({
      coursewares: coursewares.concat(data),
    });
  };

  selectedCoursewares = coursewares => {
    const uniqueCoursewares = uniqueArray(coursewares, 'id');
    return uniqueCoursewares.map(courseware => (
      <Tag closable color="blue" key={courseware}>
        {courseware.title}
      </Tag>
    ));
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  handleBeforeUpload = (file, key) => {
    if (key === 'zip') {
      this.setState({
        zipList: [file],
      });
    }
    return false;
  };

  handleRemove = () => {
    this.setState({
      zipList: [],
    });
  };

  onValidateForm = () => {
    const {
      form,
      dispatch,
      history,
      location: { pathname },
    } = this.props;
    const { validateFields } = form;
    const { coursewares, fileList, zipList } = this.state;
    const id = pathname.split('/').slice(-1)[0];

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

        if (zipList.length !== 1 || fileList.length !== 1) {
          return message.warn('请按要求上传模型或缩略图');
        } else {
          let isRequireFiles = true;
          let isRequireThumbnails = true;

          if (zipList[0] instanceof File) {
            isRequireFiles = zipList.every(zip =>
              validateFile(zip, 1024 * 1024 * 1024, ['rar', 'zip'])
            );
          }

          if (fileList[0].originFileObj) {
            isRequireThumbnails = validateThumbnails(fileList, 1, 1024 * 1024);
          }

          if (!isRequireFiles || !isRequireThumbnails) {
            return message.warn('请按要求上传模型或缩略图');
          }
        }

        Object.assign(
          values,
          {
            title: title.trim(),
          },
          { tags: filterTags.toString(), category: category.toString() },
          {
            coursewareIDs: !coursewares.length
              ? null
              : coursewares.map(courseware => courseware.id).toString(),
          },
          {
            type: 1,
          },
          {
            status: 2,
          }
        );

        this.setState({
          loading: true,
        });

        dispatch({
          type: 'material/saveUploadFiles',
          payload: {
            thumbnails: fileList,
            files: zipList,
          },
        });

        dispatch({
          type: 'material/upload',
          payload: { data: id },
        })
          .then(data => {
            const {
              uploadFiles: { file },
              uploadThumbnails: { thumbnails },
            } = data;

            return dispatch({
              type: 'material/update',
              payload: Object.assign(values, { id, file, thumbnails }),
            });
          })
          .then(() => {
            history.goBack();
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.log(error);
          });
      }
    });
  };

  render() {
    const { form, courseware, material } = this.props;
    const { data: coursewareData, pages } = courseware;
    const { getFieldDecorator } = form;
    const {
      coursewares,
      visible,
      previewImage,
      previewVisible,
      loading,
      fileList,
      zipList,
    } = this.state;
    const materialDetail = material.detail;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const uploadDraggerProps = {
      name: 'file',
      action: '',
      accept:
        'application/zip, application/x-zip-compressed, application/rar, application/x-rar-compressed',
      onRemove: this.handleRemove,
      fileList: zipList,
      beforeUpload: file => this.handleBeforeUpload(file, 'zip'),
    };

    const uploadProps = {
      name: 'thumbnails',
      action: '',
      accept: 'image/jpeg, image/png',
      listType: 'picture-card',
      fileList,
      onPreview: this.handlePreview,
      onChange: this.handleChange,
      beforeUpload: this.handleBeforeUpload,
    };

    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm}>
          <Form.Item {...formItemLayout} label="标题" help="最多 28 个字">
            {getFieldDecorator('title', {
              initialValue: materialDetail ? materialDetail.title : null,
              rules: [{ required: true, message: '请填写名称' }],
            })(<Input placeholder="请给模型起个名字" maxLength={28} />)}
          </Form.Item>

          <Form.Item {...formItemLayout} label="格式">
            {getFieldDecorator('format', {
              initialValue: materialDetail ? materialDetail.format : null,
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
              initialValue: materialDetail ? Number(materialDetail.level) : null,
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
              initialValue: materialDetail ? materialDetail.category : null,
              rules: [{ required: true, message: '请选择类别' }],
            })(<Cascader options={models} style={{ width: '100%' }} placeholder="请选择分类" />)}
          </Form.Item>

          <Form.Item {...formItemLayout} label="所属课件">
            {coursewares.length ? this.selectedCoursewares(coursewares) : null}
            <Tag
              onClick={this.handleCoursewareModal}
              style={{ background: '#fff', borderStyle: 'dashed' }}
            >
              <Icon type="plus" /> 选择课件
            </Tag>
            <Modal visible={visible} onCancel={this.handleCancel} footer={null}>
              <CoursewareList
                handleSelected={this.handleSelectedData}
                onPageChange={this.handlePageChange}
                data={coursewareData}
                pages={pages}
              />
            </Modal>
          </Form.Item>

          <Form.Item {...formItemLayout} label="标签" help="标签字数不超过 12 个字，最多 7 个标签">
            {getFieldDecorator('tags', {
              initialValue: materialDetail ? materialDetail.tags : null,
              rules: [{ required: true, message: '请给模型指定标签' }],
            })(<Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',', '，']} />)}
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label="缩略图"
            help="可以上传一个缩略图，大小不超过 1MB"
            style={{ marginBottom: '20px' }}
          >
            <div className="clearfix">
              <Upload {...uploadProps}>{fileList.length >= 1 ? null : uploadButton}</Upload>
              <Modal
                visible={previewVisible}
                footer={null}
                onCancel={() => this.handleCancel('preview')}
              >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </div>
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label="模型文件"
            help="可以上传一个 rar 或者 zip 格式的压缩包，大小不超过 1GB"
            style={{ marginBottom: '20px' }}
          >
            <Upload.Dragger {...uploadDraggerProps}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
            </Upload.Dragger>
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
            <Button type="primary" onClick={this.onValidateForm} loading={loading}>
              更新修改
            </Button>
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}
export default connect(({ material, courseware }) => ({
  material,
  courseware,
}))(Step2);
