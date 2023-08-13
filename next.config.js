const path = require('path')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  eslint: {
    dirs: ['components', 'constant', 'layouts', 'libs', 'pages', 'scripts', 'utils'],
  },
  images: {
    domains: ['i.scdn.co'],
  },
  typescript: { tsconfigPath: './tsconfig.json' },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['en', 'es', 'ca'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
  },
  trailingSlash: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|mp4)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next',
            name: 'static/media/[name].[hash].[ext]',
          },
        },
      ],
    })

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    config.module.rules.push({
      test: /\.json$/,
      use: [options.defaultLoaders.babel],
      include: path.resolve(__dirname, 'public/locales'),
    })

    return config
  },
})
