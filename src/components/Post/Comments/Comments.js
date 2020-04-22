// @flow strict
import React from 'react';
import ReactDisqusComments from 'react-disqus-comments';
import { useSiteMetadata } from '../../../hooks';

const Comments = ({ postTitle, postSlug }) => {
  const { url, disqusShortname } = useSiteMetadata();

  if (!disqusShortname) {
    return null;
  }

  return (
    <ReactDisqusComments
      shortname={disqusShortname}
      identifier={postTitle}
      title={postTitle}
      url={url + postSlug}
    />
  );
};

export default Comments;
