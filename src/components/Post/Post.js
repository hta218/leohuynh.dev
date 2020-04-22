// @flow strict
import React from 'react';
import { Link } from 'gatsby';
import Comments from './Comments';
import Content from './Content';
import Meta from './Meta';
import Tags from './Tags';
import styles from './Post.module.scss';


const Post = ({ post }) => {
  console.log("Post data", post)
  const { html, timeToRead: time } = post;
  const { tagSlugs, slug } = post.fields;
  const { tags, title, date, headerImage } = post.frontmatter;

  return (
    <div className={styles['post']}>
      <Link className={styles['post__home-button']} to="/">← All Articles</Link>
      <div className={styles['post__header-image']} style={{ backgroundImage: `url(${headerImage})` }} />

      <div className={styles['post__content']}>
        {tags && tagSlugs && <Tags tags={tags} tagSlugs={tagSlugs} />}
        <h1 className={styles['post__title']}>{title}</h1>
        <Meta date={date} time={time} />
        <Content body={html} />
      </div>
      <div className={styles['post__comments']}>
        <Comments postSlug={slug} postTitle={post.frontmatter.title} />
      </div>
    </div>
  );
};

export default Post;
