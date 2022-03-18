/** @type {import('next').NextConfig} */
module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [{ name: 'removeViewBox', active: false }]
            }
          }
        }
      ]
    })
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false
    }

    return config
  },
  reactStrictMode: true
}
