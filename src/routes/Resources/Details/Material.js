import React from 'react';
import { connect } from 'dva';
import cx from 'classnames';
import { Tag, Modal, Radio, Button, Icon } from 'antd';
import RowItem from 'components/ResourceManager/RowItem';
import styles from './Material.less';

const RadioGroup = Radio.Group;

const Download = ({ className, name, onClick }) => (
  <div className={cx(styles.download, className)}>
    <div className={styles.link}>
      <Icon type="link" theme="outlined" />
      <span>{name}</span>
    </div>
    <Button className={styles.goBack} type="primary" size="small" onClick={onClick}>
      下载
    </Button>
  </div>
);

const Model = ({ detail, previewImage, handlePreview, onDownload }) => {
  const { id, type, title, format, category, level, coursewares, tags, thumbnails, file } = detail;

  return (
    <div className={styles.model}>
      <RowItem label="名称" content={title} />
      <RowItem
        label="格式"
        content={
          <RadioGroup value={format}>
            <Radio value="fbx">fbx</Radio>
            <Radio value="abm">abm</Radio>
          </RadioGroup>
        }
      />
      <RowItem
        label="级别"
        content={
          <RadioGroup value={level}>
            <Radio value="1">精品</Radio>
            <Radio value="2">普通</Radio>
          </RadioGroup>
        }
      />
      <RowItem label="分类" content={category.join(' > ')} />
      <RowItem label="所属课件" content={coursewares.join(' ，')} />
      <RowItem
        label="标签"
        content={tags.map(item => (
          <Tag key={item}>{item}</Tag>
        ))}
      />
      <RowItem
        className={cx(styles.thumbnails)}
        label="缩略图"
        content={thumbnails.map((thumbnail, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className={styles.thumbnail} key={`${thumbnail}${index}`}>
            <img src={thumbnail} alt="缩略图" onClick={() => handlePreview(thumbnail)} />
          </div>
        ))}
      >
        <Modal
          width={780}
          visible={!!previewImage}
          footer={null}
          centered
          destroyOnClose
          onCancel={() => handlePreview('')}
        >
          <img className={styles.previewImage} src={previewImage} alt="缩略图" />
        </Modal>
      </RowItem>
      <Download className={styles.item} name={file} onClick={() => onDownload(id, type)} />
    </div>
  );
};

const Pano = ({ detail, previewImage, handlePreview }) => {
  const { title, category, tags, thumbnails, file } = detail;

  return (
    <div className={styles.pano}>
      <RowItem label="名称" content={title} />
      <RowItem label="分类" content={category.join(' > ')} />
      <RowItem
        label="分类"
        content={tags.map(item => (
          <Tag key={item}>{item}</Tag>
        ))}
      />
      <RowItem
        className={styles.thumbnails}
        label="缩略图"
        content={thumbnails.map((thumbnail, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className={styles.thumbnail} key={`${thumbnail}${index}`}>
            <img src={thumbnail} alt="缩略图" onClick={() => handlePreview(thumbnail)} />
          </div>
        ))}
      >
        <Modal
          width={780}
          visible={!!previewImage}
          footer={null}
          centered
          destroyOnClose
          onCancel={() => handlePreview('')}
        >
          <img className={styles.previewImage} src={previewImage} alt="缩略图" />
        </Modal>
      </RowItem>
      <div className={styles.previewVideo}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video src={file} controls>
          <p>你的浏览器暂时不支持播放该视频</p>
        </video>
      </div>
    </div>
  );
};

@connect(({ material }) => ({ material }))
class MaterialDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      previewImage: '',
    };
  }

  componentWillMount() {
    const {
      dispatch,
      location: { pathname },
    } = this.props;

    dispatch({
      type: 'material/fetchDetail',
      payload: { id: pathname.split('/').slice(-1)[0] },
    });
  }

  handlePreviewImage = data => {
    this.setState({
      previewImage: data,
    });
  };

  onDownload = (id, type) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'material/download',
      payload: { id, type },
    }).then(({ data }) => {
      // @see https://github.com/vivedu/VIVEDU-Store/issues/264
      window.location.href = data;
    });
  };

  render() {
    const {
      material: { detail },
      history,
    } = this.props;
    const { previewImage } = this.state;

    if (!detail) return null;

    const { type } = detail;

    return (
      <div className={styles.container}>
        {type === '1' ? (
          <Model
            detail={detail}
            previewImage={previewImage}
            handlePreview={this.handlePreviewImage}
            onDownload={this.onDownload}
          />
        ) : (
          <Pano
            detail={detail}
            previewImage={previewImage}
            handlePreview={this.handlePreviewImage}
          />
        )}
        <div className={styles.actions}>
          <Button className={styles.goBack} type="primary" onClick={() => history.goBack()}>
            返回
          </Button>
        </div>
      </div>
    );
  }
}

export default MaterialDetail;
