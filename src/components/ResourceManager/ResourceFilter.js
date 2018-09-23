import React from 'react';
import cx from 'classnames';
import styles from './ResourceFilter.less';

const ResourceFilter = ({ categories, currentType, onSelect }) => (
  <div>
    {categories.map(category => (
      <button
        key={category.name}
        className={cx(styles.category, { [styles.active]: category.name === currentType })}
        onClick={() => onSelect(category)}
      >
        {category.text}
      </button>
    ))}
  </div>
);

export default ResourceFilter;
