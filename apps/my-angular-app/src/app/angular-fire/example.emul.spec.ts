/**
 * @jest-environment node
 *
 * Required for Firebase
 * 
 * @group emulator-required
 */
import { TestBed } from '@angular/core/testing';

import { clearDatabase, clearUserAccounts } from '../emulator/emulator-helpers';
import { EmulatorInfo } from '../emulator/emulator-info';

import {
  provideFirebaseApp,
  initializeApp,
  FirebaseError,
  FirebaseApp,
  getApp,
  // FirebaseApp,
} from '@angular/fire/app';
import {
    Auth,
  provideAuth,
  initializeAuth,
  connectAuthEmulator,
  getAuth,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  provideFirestore,
  Firestore,
} from '@angular/fire/firestore';

import * as admin from 'firebase-admin';

// Fails With:
//     FirebaseError: Firebase: Error (auth/invalid-api-key).
//
xdescribe('AngularFire example', () => {
  // let app: FirebaseApp;

  beforeEach(async () => {
   // await clearUserAccounts('demo-1');
   //  await clearDatabase('demo-1');
  });

  afterEach(() => {
    // app.delete().catch(() => undefined);
  });

  it('auth and firestore', async () => {
    TestBed.configureTestingModule({
      imports: [
        // AngularFireModule,
        provideFirebaseApp(() => {           
          const app = initializeApp({
            apiKey: 'demo-1-key',
            projectId: 'demo-1',
          });

          return app;
        }),
        provideAuth(() => {
          const auth = getAuth();
          // const auth = initializeAuth(getApp());
          connectAuthEmulator(auth, 'http://localhost:9099', {
            disableWarnings: true,
          });
          return auth;
        }),
        provideFirestore(() => {
          const firestore = getFirestore();
          connectFirestoreEmulator(firestore, 'localhost', 8080);
          return firestore;
        }),
      ],
    });
/*
    // The Firebase Admin SDK automatically connects to the Authentication emulator when the FIREBASE_AUTH_EMULATOR_HOST environment variable is set.
    // https://firebase.google.com/docs/emulator-suite/connect_auth
    process.env['FIREBASE_AUTH_EMULATOR_HOST'] =
      EmulatorInfo.auth.firebaseAuthEmulatorHost;

    // The Firebase Admin SDKs automatically connect to the Cloud Firestore emulator when the FIRESTORE_EMULATOR_HOST environment variable is set.
    // https://firebase.google.com/docs/emulator-suite/connect_firestore
    process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';

    admin.initializeApp({ projectId: 'demo-1' });
*/
    // expect.hasAssertions();
    const firebaseApp = TestBed.inject(FirebaseApp);
    // const firebaseApp = getApp();
     // const afAuth = TestBed.inject(Auth);
    const afAuth = getAuth(firebaseApp);

    try {
      await signInWithEmailAndPassword(
        afAuth,
        'test@test.example',
        'passwordAAA'
      );
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(FirebaseError);
      const { code, message, name } = e as FirebaseError;
      expect(code).toBe('auth/user-not-found');
      expect(message).toBe(
        'Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).'
      );
      expect(name).toBe('FirebaseError');
    }
  });
});
