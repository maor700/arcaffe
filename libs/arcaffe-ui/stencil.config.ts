import { Config } from '@stencil/core';

import { sass } from '@stencil/sass';

import { reactOutputTarget } from '@stencil/react-output-target';

const angularValueAccessorBindings: ValueAccessorConfig[] = [];

import {
  angularOutputTarget,
  ValueAccessorConfig,
} from '@stencil/angular-output-target';

export const config: Config = {
  namespace: 'arcaffe-ui',
  taskQueue: 'async',
  plugins: [sass()],
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: '@arcaffe/arcaffe-ui',
      proxiesFile: '../../libs/arcaffe-ui-react/src/generated/components.ts',
      includeDefineCustomElements: true,
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      dir: '../../dist/libs/arcaffe-ui/dist',
    },
    {
      type: 'www',
      dir: '../../dist/libs/arcaffe-ui/www',
      serviceWorker: null, // disable service workers
    },

    angularOutputTarget({
      componentCorePackage: '@arcaffe/arcaffe-ui',
      directivesProxyFile:
        '../../../libs/arcaffe-ui-angular/src/generated/directives/proxies.ts',
      valueAccessorConfigs: angularValueAccessorBindings,
    }),
  ],
};
