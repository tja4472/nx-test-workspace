import { firebaseConfigProd } from '@nx-test-workspace/library-firebase';

import { Environment } from './environment-types';

export const environment: Environment = {
  appCode: 'ngrx-auth-module',
  production: true,
  firebase: {
    config: firebaseConfigProd,
  },
};
