/**
 * @jest-environment node
 *
 * Required for Firebase
 */
import { TestBed } from '@angular/core/testing';

import { AngularFireModule, FirebaseApp } from '@angular/fire/compat';
import {
  AngularFireAuth,
  AngularFireAuthModule,
} from '@angular/fire/compat/auth';

import * as admin from 'firebase-admin';

import { FirebaseError } from '@angular/fire/app';

import { clearUserAccounts } from '../emulator/emulator-helpers';
import { EmulatorInfo } from '../emulator/emulator-info';

describe('AngularFireCompatAuth', () => {
  let app: FirebaseApp;

  afterEach(() => {
    app.delete().catch(() => undefined);
  });

  it('signInWithEmailAndPassword auth/user-not-found', async () => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp({
          apiKey: 'demo-1-key',
          projectId: 'demo-1',
        }),
        AngularFireAuthModule,
      ],
    });

    app = TestBed.inject(FirebaseApp);
    const afAuth = TestBed.inject(AngularFireAuth);
    afAuth.useEmulator(EmulatorInfo.auth.useEmulatorUrl);

    // The Firebase Admin SDK automatically connects to the Authentication emulator when the FIREBASE_AUTH_EMULATOR_HOST environment variable is set.
    // https://firebase.google.com/docs/emulator-suite/connect_auth
    process.env['FIREBASE_AUTH_EMULATOR_HOST'] =
      EmulatorInfo.auth.firebaseAuthEmulatorHost;

    // The Firebase Admin SDKs automatically connect to the Cloud Firestore emulator when the FIRESTORE_EMULATOR_HOST environment variable is set.
    // https://firebase.google.com/docs/emulator-suite/connect_firestore
    process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';

    admin.initializeApp({ projectId: 'demo-1' });

    const result = await clearUserAccounts('demo-1');

    expect.hasAssertions();

    try {
      await afAuth.signInWithEmailAndPassword(
        'test@test.example',
        'passwordAAA'
      );
    } catch (e: any) {
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
