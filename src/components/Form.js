import React from 'react';
import cx from 'classnames';
import styles from './Form.less';

const FormCard = ({ children, title, tips }) => (
  <div className={styles.formCard}>
    <div className={styles.header}>
      <h2>{title}</h2>
      {tips && <span>{tips}</span>}
    </div>
    <div>{children}</div>
  </div>
);

const MemberCard = ({ index, data }) => {
  const { type, name, phone, dept, identityNum, changed } = data;
  const changedStrSet = changed && new Set(changed.split(','));

  return (
    <div className={styles.memberCard}>
      <div className={styles.formItem}>
        <span className={cx({ [styles.changed]: changedStrSet && changedStrSet.has('type') })}>
          成员身份(
          {parseInt(index, 10) + 1}
          )：
        </span>
        <input className={cx(styles.input)} value={type} readOnly />
      </div>
      <div className={styles.formItem}>
        <span className={cx({ [styles.changed]: changedStrSet && changedStrSet.has('name') })}>
          成员姓名：
        </span>
        <input className={cx(styles.input)} value={name} readOnly />
      </div>
      <div className={styles.formItem}>
        <span className={cx({ [styles.changed]: changedStrSet && changedStrSet.has('dept') })}>
          院系/专业：
        </span>
        <input className={cx(styles.input)} value={dept} readOnly />
      </div>
      <div className={styles.formItem}>
        <span className={cx({ [styles.changed]: changedStrSet && changedStrSet.has('phone') })}>
          {' '}
          联系电话：
        </span>
        <input className={cx(styles.input)} value={phone} readOnly />
      </div>
      <div className={styles.formItem}>
        <span
          className={cx({ [styles.changed]: changedStrSet && changedStrSet.has('identityNum') })}
        >
          身份证号码：
        </span>
        <input className={cx(styles.input)} value={identityNum} readOnly />
      </div>
    </div>
  );
};

const SchoolCard = ({ data }) => {
  const { name, dept, teacher, job, phone } = data;

  return (
    <div className={styles.schoolCard}>
      <div className={styles.formItem}>
        <span>学校名称：</span>
        <input className={cx(styles.input)} value={name} readOnly />
      </div>
      <div className={styles.formItem}>
        <span>院系专业：</span>
        <input className={cx(styles.input)} value={dept} readOnly />
      </div>
      <div className={styles.formItem}>
        <p className={styles.row}>
          <span>负责老师姓名：</span>
          <input className={cx(styles.input, styles.sm)} value={teacher} readOnly />
        </p>
        <p className={styles.row}>
          <span>职务：</span>
          <input className={cx(styles.input, styles.sm)} value={job} readOnly />
        </p>
      </div>
      <div className={styles.formItem}>
        <span>联系电话：</span>
        <input className={cx(styles.input)} value={phone} readOnly />
      </div>
    </div>
  );
};

export { FormCard, MemberCard, SchoolCard };
