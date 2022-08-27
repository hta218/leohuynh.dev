import type { CommentConfigType } from '~/types'
import { commentConfig as DefaultCommentConfig } from '~/data'

// This is a temporary workaround for the fact that the `mdx-bundler` & `esbuild`
// is not working with the NextJS's public variables.
export function getCommentConfigs(): CommentConfigType {
  return {
    ...DefaultCommentConfig,
    giscusConfig: {
      ...DefaultCommentConfig.giscusConfig,
      repo: String(process.env.GISCUS_REPO),
      repositoryId: String(process.env.GISCUS_REPOSITORY_ID),
      category: String(process.env.GISCUS_CATEGORY),
      categoryId: String(process.env.GISCUS_CATEGORY_ID),
    },
    utterancesConfig: {
      ...DefaultCommentConfig.utterancesConfig,
      repo: String(process.env.UTTERANCES_REPO),
    },
    disqus: {
      shortname: String(process.env.DISQUS_SHORTNAME),
    },
  }
}
