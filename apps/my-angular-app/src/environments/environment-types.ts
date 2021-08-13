import { FirebaseConfig } from '@nx-test-workspace/library-firebase';

type UseEmulatorArguments = [string, number];

type Firebase = {
  config: FirebaseConfig;
  emulators?: {
    auth: UseEmulatorArguments;
    firestore: UseEmulatorArguments;
  };
};

export type Environment = {
  appCode: string;
  production: boolean;
  firebase: Firebase;
};
