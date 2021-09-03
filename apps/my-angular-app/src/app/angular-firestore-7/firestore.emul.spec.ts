import {
  provideFirebaseApp,
  initializeApp,
  FirebaseApp,
} from '@angular/fire/app';
import { provideAuth, initializeAuth, getAuth } from '@angular/fire/auth';
import {
  getFirestore,
  provideFirestore,
  Firestore,
} from '@angular/fire/firestore';

import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';

import { TestBed } from '@angular/core/testing';
import { environment as demoEnvironment } from '../../environments/environment.emulator-demo';
import { AngularFireModule } from '@angular/fire/compat';
import { getApp } from 'firebase/app';
import { NgZone } from '@angular/core';

const firebaseConfigEmulatorDemo = {
  apiKey: 'AIzaSyCM95TN-IRTj0QCl2xUwNr7Q-LBzfzsT1Y',
  authDomain: 'emulators-codelab-a5a89.firebaseapp.com',
  databaseURL: 'https://emulators-codelab-a5a89.firebaseio.com',
  projectId: 'emulators-codelab-a5a89',
  storageBucket: 'emulators-codelab-a5a89.appspot.com',
  messagingSenderId: '705868832239',
  appId: '1:705868832239:web:f9d822bd4077353433ea1a',
};
/*
* Not working.
* FirebaseError: "projectId" not provided in firebase.initializeApp.
*/
xdescribe('AngularFirestoreV7', () => {
  it('test1', async () => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule,
        provideFirebaseApp(() => {
          const app = initializeApp({ projectId: 'demo-1' });
          return app;
        }),
        provideFirestore(() => {
          const firestore = getFirestore();
          connectFirestoreEmulator(firestore, 'localhost', 8080);
          return firestore;
        }),
      ],
    });

    const firebaseApp = TestBed.inject(FirebaseApp);
    console.log('firebaseApp.options>', firebaseApp.options);
    const db = getFirestore(firebaseApp);
  });
});

async function setup() {
  TestBed.configureTestingModule({
    imports: [
      provideFirebaseApp(() => {
        const app = initializeApp({ projectId: 'demo-1' });
        return app;
      }),

      /*      
      provideAuth(() => {
        const auth = getAuth();
        connectAuthEmulator(auth, 'http://localhost:9099', {
          disableWarnings: true,
        });
        return auth;
      }),
*/

      provideFirestore(() => {
        const firestore = getFirestore();
        connectFirestoreEmulator(firestore, 'localhost', 8080);
        return firestore;
      }),
    ],
  });

  const firebaseApp = TestBed.inject(FirebaseApp);
  // const firestore = TestBed.inject(Firestore);
  const db = getFirestore();
  return;
}
