import React from 'react';
import { withPrefix, Link } from 'gatsby';
import styles from './Author.module.scss';

const Author = () => (
  <div className={styles['author']}>
    <Link to="/">
      <img
        src={withPrefix('/logo.png')}
        className={styles['author__photo']}
        width="75"
        height="75"
        alt="Leo Blog"
      />
    </Link>

    <h1 className={styles['author__title']}>
      <Link className={styles['author__title-link']} to="/">Tuan Anh Huynh (Leo)</Link>
    </h1>

    <p className={styles['author__subtitle']}>I like coding, I do stuff related to JS, working mostly with React/Node and Vanilla JS.</p>
    <p className={styles['author__subtitle']}>
      I'm an ex-programming-instructor at
      <a
        className={styles['author__title-link']}
        href="https://mindx.edu.vn/"
        rel="noopener noreferrer"
        target="_blank"
      >
        &nbsp;MindX Technology & Startup School&nbsp;
      </a>
      (aka Techkids).
      <br />
      Also ex-developer at {' '}
      <a
        className={styles['author__title-link']}
        href="https://apps.shopify.com/pagefly"
        target="_blank"
        rel="noopener noreferrer"
      >
        PageFly
      </a>
      {' '}(Top 3 page builder app on Shopify app store).
    </p>
    <p className={styles['author__subtitle']}>
      Becoming a software engineer at
      <a
        className={styles['author__title-link']}
        href="https://coccoc.com/" target="_blank"
        rel="noopener noreferrer"
      >
        &nbsp;Coc Coc&nbsp;
      </a>
      (starting from May 2020).
    </p>
  </div>
);

export default Author;
