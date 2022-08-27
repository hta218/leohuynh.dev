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
    domains: ['img.shields.io', 'i.scdn.co'],
  },
  typescript: { tsconfigPath: './tsconfig.json' },
  webpack: (config, { dev, isServer }) => {
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

    // if (!dev && !isServer) {
    // 	// Replace React with Preact only in client production build
    // 	Object.assign(config.resolve.alias, {
    // 		'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
    // 		react: 'preact/compat',
    // 		'react-dom/test-utils': 'preact/test-utils',
    // 		'react-dom': 'preact/compat',
    // 	})
    // }

    return config
  },
})
