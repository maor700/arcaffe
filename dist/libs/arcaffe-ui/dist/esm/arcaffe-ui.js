import { p as promiseResolve, b as bootstrapLazy } from './index-b2200620.js';

/*
 Stencil Client Patch Browser v2.11.0 | MIT Licensed | https://stenciljs.com
 */
const patchBrowser = () => {
    const importMeta = import.meta.url;
    const opts = {};
    if (importMeta !== '') {
        opts.resourcesUrl = new URL('.', importMeta).href;
    }
    return promiseResolve(opts);
};

patchBrowser().then(options => {
  return bootstrapLazy([["my-component",[[1,"my-component",{"first":[1],"middle":[1],"last":[1],"testFunc":[64]}]]],["ui-list",[[0,"ui-list",{"sourceName":[1,"source-name"],"materials":[32],"selected":[32]}]]]], options);
});
