import type { CommentConfigType } from '~/types/components'
import { commentConfig as DefaultCommentConfig } from '~/data/siteMetadata'

// This is a temporary workaround for the fact that the `mdx-bundler` & `esbuild`
// is not working with the NextJS's public variables.
export function getCommentConfigs(): CommentConfigType {
  return {
    ...DefaultCommentConfig,
    giscusConfig: {
      ...DefaultCommentConfig.giscusConfig,
      repo: process.env.GISCUS_REPO || null,
      repositoryId: process.env.GISCUS_REPOSITORY_ID || null,
      category: process.env.GISCUS_CATEGORY || null,
      categoryId: process.env.GISCUS_CATEGORY_ID || null,
    },
    utterancesConfig: {
      ...DefaultCommentConfig.utterancesConfig,
      repo: process.env.UTTERANCES_REPO || null,
    },
    disqus: {
      shortname: process.env.DISQUS_SHORTNAME || null,
    },
  }
}
