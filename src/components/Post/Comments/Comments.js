// @flow strict
import React from 'react';
import NinjaComments from 'remark-ninja-react';
import { useSiteMetadata } from '../../../hooks';

const Comments = ({ postTitle, postSlug }) => {
  const { url } = useSiteMetadata();

  return (
    <NinjaComments
      siteId={"ec72f46b-042c-43ff-9fe0-1b26192462b8"}
    />
  );
};

export default Comments;
