#!/bin/env node

/* eslint no-use-before-define:0 */

const path = require('path');
const fs = require('fs');

const swig = require('swig');
const data = require('../lib');

buildIndex();

function buildIndex() {
  const template = swig.compileFile(path.resolve(__dirname, '../site/index.html'));
  fs.writeFileSync(path.resolve(__dirname, '../gh-pages/index.html'), template(data), 'utf-8');
}
