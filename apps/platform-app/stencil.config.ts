import { Config } from '@stencil/core';
import { less } from '@stencil/less';
// https://stenciljs.com/docs/config

export const config: Config = {
  globalStyle: 'src/global/app.less',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'www',
      // comment the following line to disable service workers in production
      serviceWorker: null,
      baseUrl: 'https://.local/',
    },
  ]
,
  plugins: [less()],
  devServer:{port:3334}

};
