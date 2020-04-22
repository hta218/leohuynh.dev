// @flow strict
import React from 'react';
import styles from './Content.module.scss';

const Content = ({ body }) => (
  <div className={styles['content']}>
    <div className={styles['content__body']} dangerouslySetInnerHTML={{ __html: body }} />
  </div>
);

export default Content;
