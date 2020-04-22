// @flow strict
import React from 'react';
import { Link } from 'gatsby';
import styles from './Tags.module.scss';

const Tags = ({ tags, tagSlugs }) => (
  <div className={styles['tags']}>
    <ul className={styles['tags__list']}>
      {tagSlugs && tagSlugs.map((slug, i) => (
        <li className={styles['tags__list-item']} key={tags[i]}>
          <Link to={slug} className={styles['tags__list-item-link']}>
            #{tags[i]}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default Tags;
