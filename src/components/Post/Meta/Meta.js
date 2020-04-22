// @flow strict
import React from 'react';
import { format } from 'date-fns'
import styles from './Meta.module.scss';

const Meta = ({ date, time }) => (
  <div className={styles['meta']}>
    <p className={styles['meta__date']}>
      📅 {format(new Date(date), 'MMMM dd, yyyy')} - ⏱️{time} min{time > 1 && 's'} read
    </p>
  </div>
);

export default Meta;
