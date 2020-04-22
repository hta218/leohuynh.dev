import React from 'react';
import styles from './Copyright.module.scss';

const Copyright = ({ copyright }) => (
  <div className={styles['copyright']}>
    {copyright}
  </div>
);

export default Copyright;
