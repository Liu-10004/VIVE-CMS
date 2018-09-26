import React, { Fragment } from 'react';
import cx from 'classnames';
import styles from './RowItem.less';

const RowItem = ({ className, label, content, children }) => (
  <Fragment>
    <div className={cx(styles.root, className)}>
      <span className={styles.label}>{`${label}:`} </span>
      {content}
    </div>
    {children}
  </Fragment>
);

export default RowItem;
