/**
 * @jest-environment node
 *
 * Required for Firebase
 */
import { AngularFireModule, FirebaseApp } from '@angular/fire';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreModule,
  SETTINGS,
} from '@angular/fire/firestore';
import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';

import { environment } from '../../environments/environment.emulator-demo';
import { AngularFireAuth } from '@angular/fire/auth';
import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/auth';

describe('AngularFirestore', () => {
  let app: FirebaseApp;
  let afs: AngularFirestore;
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase.config),
        AngularFirestoreModule.enablePersistence(),
      ],
      providers: [
        AngularFireAuth,
        { provide: SETTINGS, useValue: { host: 'localhost:8080', ssl: false } },
        {
            provide: USE_AUTH_EMULATOR,
            useValue: environment.firebase.emulators?.auth,
          },        
      ],
    });

    app = TestBed.inject(FirebaseApp);
    afs = TestBed.inject(AngularFirestore);
    service = TestBed.inject(AuthenticationService);
  });

  afterEach(() => {
    app.delete().catch();
  });

  it('creates an account', async () => {
    const result = await service.createAccount('test@test.example', 'password');

    expect(result).toEqual(true);
  });
});
