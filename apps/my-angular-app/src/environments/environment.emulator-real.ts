import { firebaseConfigDev } from '@nx-test-workspace/library-firebase';

import { Environment } from './environment-types';

export const environment: Environment = {
  appCode: 'ngrx-auth-module',
  production: false,
  firebase: {
    config: firebaseConfigDev,
    emulators: { auth: ['localhost', 9099], firestore: ['localhost', 8080] },
  },
};
