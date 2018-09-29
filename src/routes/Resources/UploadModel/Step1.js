import React from 'react';
import { connect } from 'dva';
import { Form, Button, Upload, Icon, message, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import { validateThumbnails, validateFile } from 'utils/utils';
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
      zipList: [],
    };
  }

  handleBeforeUpload = (file, key) => {
    if (key === 'zip') {
      const { zipList } = this.state;
      this.setState({
        zipList: zipList.concat(file),
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

  handleRemove = file => {
    const { zipList } = this.state;
    zipList.map((zip, index) => (zip.uid === file.uid ? zipList.splice(index, 1) : null));
    this.setState({
      zipList,
    });
  };

  render() {
    const { dispatch } = this.props;
    const { previewVisible, previewImage, fileList, zipList } = this.state;
    const onValidateForm = () => {
      const isRequireThumbnails = validateThumbnails(fileList, 1, 1024 * 1024);
      const isRequireFiles = zipList.every(zip =>
        validateFile(zip, 1024 * 1024 * 1024, ['rar', 'zip'])
      );

      if (!isRequireThumbnails || !isRequireFiles || zipList.length > 1) {
        message.warn('请检查上传的模型和缩略图文件的大小和格式');
      } else {
        dispatch({
          type: 'material/saveUploadFiles',
          payload: {
            thumbnails: fileList,
            files: zipList,
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
      accept:
        'application/zip, application/x-zip-compressed, application/rar, application/x-rar-compressed',
      onRemove: this.handleRemove,
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
          {...formItemLayout}
          label="缩略图"
          help="可以上传一个缩略图，大小不超过 1MB"
          style={{ marginBottom: '20px' }}
        >
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
