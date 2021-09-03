/**
 * @jest-environment node
 *
 * Required for Firebase
 */
import { AngularFireModule, FirebaseApp } from '@angular/fire/compat';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreModule,
  SETTINGS,
} from '@angular/fire/compat/firestore';
import { TestBed } from '@angular/core/testing';

//import admin = require("firebase-admin");

import * as admin from 'firebase-admin';

import { AuthenticationService } from './authentication.service';

import { environment } from '../../environments/environment.emulator-demo';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/compat/auth';

describe('AngularFirestore', () => {
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
    let usersToDelete: string[] = [];
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
