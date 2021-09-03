/**
 * @jest-environment node
 *
 * Required for Firebase
 */
import { AngularFireModule, FirebaseApp,  } from '@angular/fire/compat';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreModule,
  SETTINGS, 
} from '@angular/fire/compat/firestore';
import { TestBed } from '@angular/core/testing';

import { environment } from '../environments/environment.emulator-demo';

describe('AngularFirestore', () => {
  let app: FirebaseApp;
  let afs: AngularFirestore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase.config),
        AngularFirestoreModule.enablePersistence(),
      ],
      providers: [
        { provide: SETTINGS, useValue: { host: 'localhost:8080', ssl: false } },
      ],
    });

    app = TestBed.inject(FirebaseApp);
    afs = TestBed.inject(AngularFirestore);  
  });

  afterEach(() => {
    app.delete().catch();
  });

  it('should be the properly initialized type', () => {
    expect(afs instanceof AngularFirestore).toBe(true);
  });

  it('should have an initialized Firebase app', () => {
    expect(afs.firestore.app).toBeDefined();
  });

  it('should create an AngularFirestoreDocument from a string path', () => {
    const doc = afs.doc('a/doc');
    expect(doc instanceof AngularFirestoreDocument).toBe(true);
  });  
});
