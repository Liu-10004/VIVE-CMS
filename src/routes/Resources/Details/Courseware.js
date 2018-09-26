import React from 'react';
import { Radio, Tag, Modal, Button } from 'antd';
import { connect } from 'dva';
import cx from 'classnames';
import RowItem from 'components/ResourceManager/RowItem';
import styles from './Courseware.less';

const RadioGroup = Radio.Group;
@connect(({ courseware }) => ({ courseware }))
class CoursewareDetail extends React.Component {
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
      type: 'courseware/fetchDetail',
      payload: { id: pathname.split('/').slice(-1)[0] },
    });
  }

  render() {
    const {
      courseware: { detail },
      history,
    } = this.props;

    if (!detail) return null;

    const { previewImage } = this.state;
    const { title, category, label, tags, summary, thumbnails } = detail;

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <RowItem label="课件名称" content={title} />
          <RowItem label="分类" content={category.join(' > ')} />
          <RowItem
            label="年级/专业"
            content={label.join('，')}
          />
          <RowItem
            label="标签"
            content={tags.map(item => (
              <Tag key={item}>{item}</Tag>
            ))}
          />
          <RowItem label="课程介绍" content={<div className={styles.description}>{summary}</div>} />
          <RowItem
            label="缩略图"
            content={thumbnails.map((thumbnail, index) => (
              <div className={styles.thumbnail} key={`${thumbnail}${index}`}>
                <img
                  src={thumbnail}
                  alt="缩略图"
                  onClick={() => this.setState({ previewImage: thumbnail })}
                />
              </div>
            ))}
          >
            <Modal
              width={880}
              visible={!!previewImage}
              footer={null}
              centered
              destroyOnClose
              onCancel={() => this.setState({ previewImage: '' })}
            >
              <img className={styles.previewImage} src={previewImage} alt="缩略图" />
            </Modal>
          </RowItem>
          <div className={styles.actions}>
            <Button className={styles.goBack} type="primary" onClick={() => history.goBack()}>
              返回
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default CoursewareDetail;
