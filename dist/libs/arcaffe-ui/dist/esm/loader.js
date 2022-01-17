import { p as promiseResolve, b as bootstrapLazy } from './index-b2200620.js';

/*
 Stencil Client Patch Esm v2.11.0 | MIT Licensed | https://stenciljs.com
 */
const patchEsm = () => {
    return promiseResolve();
};

const defineCustomElements = (win, options) => {
  if (typeof window === 'undefined') return Promise.resolve();
  return patchEsm().then(() => {
  return bootstrapLazy([["my-component",[[1,"my-component",{"first":[1],"middle":[1],"last":[1],"testFunc":[64]}]]],["ui-list",[[0,"ui-list",{"sourceName":[1,"source-name"],"materials":[32],"selected":[32]}]]]], options);
  });
};

export { defineCustomElements };
