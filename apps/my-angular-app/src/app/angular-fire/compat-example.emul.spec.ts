/**
 * @jest-environment node
 *
 * Required for Firebase
 * 
 * @group emulator-required
 */
import { TestBed } from '@angular/core/testing';

import { AngularFireModule, FirebaseApp } from '@angular/fire/compat';
import {
  AngularFireAuth,
  AngularFireAuthModule,
} from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreModule,
} from '@angular/fire/compat/firestore';

import * as admin from 'firebase-admin';

import { FirebaseError } from '@angular/fire/app';

import { clearDatabase, clearUserAccounts } from '../emulator/emulator-helpers';
import { EmulatorInfo } from '../emulator/emulator-info';

describe('AngularFireCompat example', () => {
  let app: FirebaseApp;

  beforeEach(async () => {
    await clearUserAccounts('demo-1');
    await clearDatabase('demo-1');
  });

  afterEach(() => {
    app.delete().catch(() => undefined);
  });

  it('auth and firestore', async () => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp({
          apiKey: 'demo-1-key',
          projectId: 'demo-1',
        }),
        AngularFireAuthModule,
        AngularFirestoreModule,
      ],
    });

    app = TestBed.inject(FirebaseApp);
    const afAuth = TestBed.inject(AngularFireAuth);
    afAuth.useEmulator(EmulatorInfo.auth.useEmulatorUrl);
    const afFirestore = TestBed.inject(AngularFirestore);
    afFirestore.firestore.useEmulator('localhost', 8080);

    // The Firebase Admin SDK automatically connects to the Authentication emulator when the FIREBASE_AUTH_EMULATOR_HOST environment variable is set.
    // https://firebase.google.com/docs/emulator-suite/connect_auth
    process.env['FIREBASE_AUTH_EMULATOR_HOST'] =
      EmulatorInfo.auth.firebaseAuthEmulatorHost;

    // The Firebase Admin SDKs automatically connect to the Cloud Firestore emulator when the FIRESTORE_EMULATOR_HOST environment variable is set.
    // https://firebase.google.com/docs/emulator-suite/connect_firestore
    process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';

    admin.initializeApp({ projectId: 'demo-1' });

    expect.hasAssertions();

    try {
      await afAuth.signInWithEmailAndPassword(
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

    interface Item {
      name: string;
      price: number;
    }

    const shirtsCollection = afFirestore.collection<Item>('tshirts');
    const addedDoc = await shirtsCollection.add({ name: 'item', price: 10 });

    const actualDoc = await shirtsCollection.doc(addedDoc.id).ref.get();
    const expectedDoc: Item = { name: 'item', price: 10 };

    expect(actualDoc.data()).toEqual(expectedDoc);
  });
});
