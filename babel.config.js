module.exports = {
  presets: [['@babel/preset-env'], ['@babel/preset-react']],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-class-properties',
    [
      '@babel/plugin-transform-runtime',
      { corejs: { version: 3, proposals: true }, regenerator: true }
    ]
  ]
}