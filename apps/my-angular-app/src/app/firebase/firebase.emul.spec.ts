import { TestBed } from '@angular/core/testing';

import { initializeApp, deleteApp, getApp } from 'firebase/app';
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} from 'firebase/firestore';

import { HttpClient, HttpClientModule } from '@angular/common/http';

// https://firebase.google.com/docs/emulator-suite/connect_firestore
// https://firebase.google.com/docs/firestore

const firebaseConfigEmulatorDemo = {
  apiKey: 'AIzaSyCM95TN-IRTj0QCl2xUwNr7Q-LBzfzsT1Y',
  authDomain: 'emulators-codelab-a5a89.firebaseapp.com',
  databaseURL: 'https://emulators-codelab-a5a89.firebaseio.com',
  projectId: 'emulators-codelab-a5a89',
  storageBucket: 'emulators-codelab-a5a89.appspot.com',
  messagingSenderId: '705868832239',
  appId: '1:705868832239:web:f9d822bd4077353433ea1a',
};

let http: HttpClient;

describe('Firebase', () => {
  beforeAll(() => {
    TestBed.configureTestingModule({ imports: [HttpClientModule] });
    http = TestBed.inject(HttpClient);

    const app = initializeApp({ projectId: 'demo-1' });
    const db = getFirestore();
    connectFirestoreEmulator(db, 'localhost', 8080);
  });

  afterAll(() => {
    deleteApp(getApp());
  });

  it('test1', async () => {
    const db = getFirestore();
    await clearDatabase('demo-1', http);

    // Add a new document in collection "cities"
    await setDoc(doc(db, 'cities', 'LA'), {
      name: 'Los Angeles',
      state: 'CA',
      country: 'USA',
    });

    expect(1).toBe(1);
  });

  it('test2', async () => {
    const db = getFirestore();
    await clearDatabase('demo-1', http);

    // Add a new document in collection "cities"
    await setDoc(doc(db, 'cities', 'AA'), {
      name: 'Los Angeles',
      state: 'CAB',
      country: 'USA',
    });
  });
});

async function clearDatabase(projectId: string, http: HttpClient) {
  // "http://localhost:8080/emulator/v1/projects/firestore-emulator-example/databases/(default)/documents"
  // console.log('>', `http://localhost:8080/emulator/v1/${projectId}/demo-1/databases/(default)/documents`)
  return http
    .delete(
      `http://localhost:8080/emulator/v1/projects/${projectId}/databases/(default)/documents`
    )
    .toPromise();
}
