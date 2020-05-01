// @flow strict
import React from 'react';
import Helmet from 'react-helmet';
import { withPrefix } from 'gatsby';
import { useSiteMetadata } from '../../hooks';
import styles from './Layout.module.scss';

const Layout = ({
  children,
  title,
  description,
  socialImage
}) => {
  const { author, url } = useSiteMetadata();
  const metaImage = socialImage != null ? socialImage : author.photo;
  // const metaImageUrl = url + withPrefix(metaImage);
  const metaImageUrl = metaImage;

  return (
    <div className={styles.layout}>
      <Helmet>
        <html lang="en" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content={title} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={metaImageUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={metaImageUrl} />
      </Helmet>
      {children}
    </div>
  );
};

export default Layout;
