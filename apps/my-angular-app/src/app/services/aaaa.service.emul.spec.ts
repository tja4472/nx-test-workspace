/**
 * @jest-environment node
 *
 * Required for Firebase
 * 
 * @group emulator-required
 */
import { AngularFireModule, FirebaseApp } from '@angular/fire/compat';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreModule,
  SETTINGS,
} from '@angular/fire/compat/firestore';
import { TestBed } from '@angular/core/testing';

import * as admin from 'firebase-admin';

import { AuthenticationService } from './authentication.service';

import { environment } from '../../environments/environment.emulator-demo';
import {
  AngularFireAuth,
  AngularFireAuthModule,
} from '@angular/fire/compat/auth';
import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/compat/auth';
import { FirebaseError } from '@angular/fire/app';

import { clearUserAccounts } from '../emulator/emulator-helpers';

/*
   if both xdescribed removed.
    FirebaseError: Firebase: Auth instance has already been used to make a network call. Auth can no longer be configured to use the emulator. Try calling "connectAuthEmulator()" sooner. (auth/emulator-config-failed).
*/
xdescribe('Test1', () => {
  let app: FirebaseApp;
  let service: AuthenticationService;

  afterEach(() => {
    app.delete().catch(() => undefined);
  });

  it('Test1A', async () => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp({
          apiKey: 'demo-1-key',
          projectId: 'demo-1',
        }),
        AngularFireAuthModule,
      ],
/*      
      providers: [
        {
          provide: SETTINGS,
          useValue: { appVerificationDisabledForTesting: true },
        },
      ],
*/      
    });

    app = TestBed.inject(FirebaseApp);
    const afAuth = TestBed.inject(AngularFireAuth);
    afAuth.useEmulator('http://localhost:9099');
    // const x = firebase.auth();
    // app.auth().useEmulator('http://localhost:9099');
    // x.useEmulator('http://localhost:9099');
    // app.firestore().useEmulator('localhost', 8080);

    service = TestBed.inject(AuthenticationService);

    // The Firebase Admin SDK automatically connects to the Authentication emulator when the FIREBASE_AUTH_EMULATOR_HOST environment variable is set.
    // https://firebase.google.com/docs/emulator-suite/connect_auth
    process.env['FIREBASE_AUTH_EMULATOR_HOST'] = 'localhost:9099';

    // The Firebase Admin SDKs automatically connect to the Cloud Firestore emulator when the FIRESTORE_EMULATOR_HOST environment variable is set.
    // https://firebase.google.com/docs/emulator-suite/connect_firestore
    process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';

    admin.initializeApp({ projectId: 'demo-1' });

    try {
      // clearUserAccounts('demo-1');
      const result = await clearUserAccounts('demo-1');
      console.log(`statusCode: ${result}`);
    } catch (e) {
      console.log('#####>', e);
    }
    expect.hasAssertions();

    try {
      // await service.signIn1('test@test.example', 'passwordAAA');
      await afAuth.signInWithEmailAndPassword('test@test.example', 'passwordAAA');
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

/*
// https://firebase.google.com/docs/reference/rest/auth#section-auth-emulator-clearaccounts
function clearUserAccounts(projectId: string) {
  const options: http.RequestOptions = {
    host: `localhost`,
    path: `/emulator/v1/projects/${projectId}/accounts`,
    method: 'DELETE',
    port: 9099,
  };

  return new Promise<http.IncomingMessage>((resolve, reject) => {
    const req = http.request(options, (res) => {
      resolve(res);
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}
*/

xdescribe('AngularFirestore', () => {
  let app: FirebaseApp;
  let afs: AngularFirestore;
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase.config),
        // AngularFirestoreModule.enablePersistence(),
      ],
      /*      
      providers: [
        AngularFireAuth,
        { provide: SETTINGS, useValue: { host: 'localhost:8080', ssl: false } },       
      ],
*/
    });

    app = TestBed.inject(FirebaseApp);
    app.auth().useEmulator('http://localhost:9099');
    app.firestore().useEmulator('localhost', 8080);

    service = TestBed.inject(AuthenticationService);

    const useEmulator = true;

    if (useEmulator) {
      process.env['FIREBASE_AUTH_EMULATOR_HOST'] = 'localhost:9099';
      process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';
    }

    admin.initializeApp({ projectId: 'demo-1' });

    afs = TestBed.inject(AngularFirestore);

    service = TestBed.inject(AuthenticationService);
  });

  afterEach(() => {
    // app.delete().catch();
  });

  it('creates an account', async () => {
    const usersToDelete: string[] = [];
    const listUsersResult = await admin.auth().listUsers();
    listUsersResult.users.forEach((userRecord) => {
      console.log('l>', userRecord.uid);
      usersToDelete.push(userRecord.uid);
    });

    await admin.auth().deleteUsers(usersToDelete);

    const result = await service.createAccount('test@test.example', 'password');

    expect(result).toEqual(true);
  });

  it('signIn ', async () => {
    /*      
    let usersToDelete: string[] = [];
    const listUsersResult = await admin.auth().listUsers();
    listUsersResult.users.forEach((userRecord) => {
      console.log('l>', userRecord.uid);
      usersToDelete.push(userRecord.uid);
    });

    await admin.auth().deleteUsers(usersToDelete);

    await admin
      .auth()
      .createUser({
        uid: 'uid1',
        email: 'test@test.example',
        password: 'password',
      });
*/
    expect.assertions(1);
    await expect(
      service.signIn1('test@test.example', 'passwordAAA')
    ).rejects.toEqual(
      'There is no user record corresponding to this identifier. The user may have been deleted.'
    );
  });

  // Testing for async errors using Promise.catch.
  it('tests error with promises', async () => {
    expect.assertions(1);
    return service.signIn1('test@test.example', 'passwordAAA').catch((e) => {
      expect(e).toEqual({
        code: 'auth/user-not-found',
        message:
          'There is no user record corresponding to this identifier. The user may have been deleted.',
        a: null,
      });
    });
  });

  // Or using async/await.
  it('tests error with async/await', async () => {
    expect.assertions(1);
    try {
      await service.signIn1('test@test.example', 'passwordAAA');
    } catch (e) {
      expect(e).toEqual({
        code: 'auth/user-not-found',
        message:
          'There is no user record corresponding to this identifier. The user may have been deleted.',
        a: null,
      });
    }
  });

  // Or using async/await with `.rejects`.
  it('tests error with async/await and rejects', async () => {
    expect.assertions(1);
    await expect(
      service.signIn1('test@test.example', 'passwordAAA')
    ).rejects.toEqual({
      code: 'auth/user-not-found',
      message:
        'There is no user record corresponding to this identifier. The user may have been deleted.',
      a: null,
    });
  });
});
