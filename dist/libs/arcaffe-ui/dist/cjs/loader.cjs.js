'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-1fb9cd68.js');

/*
 Stencil Client Patch Esm v2.11.0 | MIT Licensed | https://stenciljs.com
 */
const patchEsm = () => {
    return index.promiseResolve();
};

const defineCustomElements = (win, options) => {
  if (typeof window === 'undefined') return Promise.resolve();
  return patchEsm().then(() => {
  return index.bootstrapLazy([["my-component.cjs",[[1,"my-component",{"first":[1],"middle":[1],"last":[1],"testFunc":[64]}]]],["ui-list.cjs",[[0,"ui-list",{"sourceName":[1,"source-name"],"materials":[32],"selected":[32]}]]]], options);
  });
};

exports.defineCustomElements = defineCustomElements;
