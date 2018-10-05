import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Icon, Radio, Modal, Tag, Cascader, message } from 'antd';
import CoursewareList from 'components/CoursewareTable';
import { models } from 'enums/ResourceOptions';
import { filterArraySpace, validateTagLength, uniqueArray } from 'utils/utils';
import styles from './VerifyMaterial.less';

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
class VerifyMaterial extends React.PureComponent {
  state = {
    visible: false,
    coursewares: [],
    previewImage: '',
    previewVisible: false,
  };

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
      if (materialDetail.coursewares) {
        this.setState({
          coursewares: materialDetail.coursewares,
        });
      }
    });
  }

  handleCancelPreview = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file,
      previewVisible: true,
    });
  };

  handleCoursewareModal = () => {
    this.setState({
      visible: true,
    });

    this.fetchCoursewares({});
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
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

  handlePageChange = page => {
    this.fetchCoursewares({ page: page - 1 });
  };

  fetchCoursewares = payload => {
    const { dispatch } = this.props;

    dispatch({
      type: 'courseware/fetch',
      payload: Object.assign(payload, { status: 1, role: 0 }),
    });
  };

  showThumbnail = materialDetail => {
    const files = [];
    const { thumbnails } = materialDetail;
    thumbnails.map(thumbnail => {
      return files.push(
        <div
          className={styles.thumbnail}
          key={`${thumbnail}`}
          onClick={() => this.handlePreview(thumbnail)}
        >
          <img alt="example" style={{ width: '100px', height: '100px' }} src={thumbnail} />
        </div>
      );
    });

    return files;
  };

  onDownload = (id, type) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'material/download',
      payload: { id, type },
    }).then(downloadURL => {
      // @see https://github.com/vivedu/VIVEDU-Store/issues/264
      window.location.href = downloadURL;
    });
  };

  onValidateForm = (event, type) => {
    const {
      form,
      dispatch,
      history,
      location: { pathname },
    } = this.props;
    const { validateFields } = form;
    const { coursewares } = this.state;
    validateFields((err, values) => {
      if (!err) {
        const { title, tags, category, reason } = values;
        const filterTags = filterArraySpace(tags);
        const tagsLength = filterTags.length;

        if (type === 'fall') {
          if (!reason || !reason.trim()) {
            return message.warn('请输入不通过的理由');
          }
          Object.assign(values, { status: 3 });
        } else {
          // eslint-disable-next-line no-param-reassign
          delete values.reason;
          Object.assign(values, { status: 1 });
        }

        if (!title.trim()) {
          return message.warn('标题不符合上传要求');
        }

        if (!validateTagLength(filterTags, 6) || tagsLength > 7 || !tagsLength) {
          return message.warn('标签不符合上传要求');
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
            id: pathname.split('/').slice(-1)[0],
          }
        );

        dispatch({
          type: 'material/update',
          payload: values,
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
    const {
      form,
      courseware,
      material,
      history,
      location: { pathname },
    } = this.props;
    const { data: coursewareData, pages } = courseware;
    const { getFieldDecorator } = form;
    const { coursewares, visible, previewImage, previewVisible } = this.state;
    const materialDetail = material.detail;
    const materialID = pathname.split('/').slice(-1)[0];
    const tokenType = 0;

    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm}>
          <Form.Item {...formItemLayout} label="标题" help="最多 28 个字">
            {getFieldDecorator('title', {
              initialValue: materialDetail ? materialDetail.title : null,
              rules: [{ required: true, message: '请填写名称' }],
            })(<Input placeholder="请给模型起个名字" maxLength={14} />)}
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

          <Form.Item {...formItemLayout} className={styles.wrapper} label="缩略图">
            <div className="clearfix">
              <div className={styles.thumbnails}>
                {materialDetail ? this.showThumbnail(materialDetail) : null}
              </div>
              <Modal
                width={600}
                visible={previewVisible}
                footer={null}
                onCancel={this.handleCancelPreview}
              >
                <img style={{ width: '100%' }} src={previewImage} alt="thumbnail" />
              </Modal>
            </div>
          </Form.Item>

          <div className={styles.download}>
            <span className={styles.name}>{materialDetail ? materialDetail.file : null}</span>
            <Button
              className={styles.btn}
              type="primary"
              onClick={() => this.onDownload(materialID, tokenType)}
            >
              下载
            </Button>
          </div>

          <div className={styles.verify}>
            <Button type="primary" key="primary" onClick={this.onValidateForm}>
              通过
            </Button>
            <Form.Item {...formItemLayout}>
              {getFieldDecorator('reason', {
                rules: [{ required: false, message: '请填写不通过的理由' }],
              })(
                <Input
                  style={{ marginLeft: '45px', width: '300px' }}
                  placeholder="请填写不通过的理由"
                  maxLength={40}
                />
              )}
            </Form.Item>
            <Button
              type="primary"
              onClick={() => this.onValidateForm(event, 'fall')}
              className={styles.fall}
            >
              不通过
            </Button>
            <Button type="primary" onClick={() => history.goBack()}>
              返回
            </Button>
          </div>
        </Form>
      </Fragment>
    );
  }
}

export default connect(({ material, courseware }) => ({
  material,
  courseware,
}))(VerifyMaterial);
