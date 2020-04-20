'use strict';

const babelOptions = {
  presets: [
    '@babel/react',
    '@babel/env',
    'babel-preset-gatsby'
  ],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-flow-strip-types',
  ],
};

module.exports = require('babel-jest').createTransformer(babelOptions);
