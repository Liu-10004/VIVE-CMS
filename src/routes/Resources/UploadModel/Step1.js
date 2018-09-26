import React from 'react';
import { connect } from 'dva';
import { Form, Button, Upload, Icon, message, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import { validateThumbnails } from 'utils/utils';
import styles from './style.less';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ material }) => ({
  data: material,
}))
@Form.create()
export default class Step1 extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      zipFile: [],
    };
  }

  handleBeforeUpload = (file, key) => {
    if (key === 'zip') {
      const { lastModified, lastModifiedDate, name, size, type, uid, webkitRelativePath } = file;
      const { zipFile } = this.state;
      this.setState({
        zipFile: zipFile.concat({
          lastModified,
          lastModifiedDate,
          name,
          size,
          type,
          uid,
          webkitRelativePath,
        }),
      });
    }
    return false;
  };

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handleChange = ({ fileList }) => this.setState({ fileList });

  render() {
    const { dispatch } = this.props;
    const { previewVisible, previewImage, fileList, zipFile } = this.state;
    const onValidateForm = () => {
      const zip = validateThumbnails(zipFile, 1, 1024 * 1024 * 1024 * 1024);
      const thumbnails = validateThumbnails(fileList, 1, 1024 * 1024);
      if (!zip || !thumbnails) {
        message.warn('请检查上传的模型和缩略图文件的大小和格式');
      } else {
        dispatch({
          type: 'material/saveUploadFiles',
          payload: {
            thumbnails: fileList,
            files: zipFile,
          },
        });
        dispatch(routerRedux.push('/resources/upload-model/step2'));
      }
    };

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const uploadDraggerProps = {
      name: 'file',
      action: '',
      accept: 'application/zip, application/rar, application/x-rar-compressed',
      fileList: zipFile,
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
      <Form layout="horizontal" className={styles.stepForm}>
        <Form.Item {...formItemLayout} label="模型文件">
          <Upload.Dragger {...uploadDraggerProps}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
          </Upload.Dragger>
        </Form.Item>
        <Form.Item {...formItemLayout} label="缩略图">
          <div className="clearfix">
            <Upload {...uploadProps}>{fileList.length >= 1 ? null : uploadButton}</Upload>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
          label=""
        >
          <Button type="primary" onClick={onValidateForm}>
            下一步
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
