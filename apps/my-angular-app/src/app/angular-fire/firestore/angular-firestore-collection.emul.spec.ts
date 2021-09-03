/**
 * @jest-environment node
 *
 * Required for Firebase
 */
import { AngularFireModule, FirebaseApp } from '@angular/fire/compat';
import {
  AngularFirestore,
} from '@angular/fire/compat/firestore';
import { TestBed } from '@angular/core/testing';
import { environment as demoEnvironment } from '../../../environments/environment.emulator-demo';
import * as admin from 'firebase-admin';

import {
  Collection,
  importDatabase,
  SaveFunction,
} from '@nx-test-workspace/firestore-tests';
import { first } from 'rxjs/operators';

// Collections in AngularFirestore
// https://github.com/angular/angularfire/blob/master/docs/firestore/collections.md

interface Item {
  name: string;
}

let adminApp: admin.app.App;

describe('AngularFirestoreCollection', () => {
  let firebaseApp: FirebaseApp;

  /*
  beforeAll(() => {
    // for admin SDK
    process.env['FIREBASE_AUTH_EMULATOR_HOST'] = 'localhost:9099';
    process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';

    admin.initializeApp({ projectId: 'demo-1' });
  });
*/

  afterEach(async () => {
    await firebaseApp.delete().catch();
  });

  type Database = {
    __items: Collection<Item>;
  };

  it('valueChanges', async () => {
    const database: Database = {
      __items: {
        aaa: { name: 'Fred' },
        bbb: { name: 'Harry' },
      },
    };

    const expected: Item[] = [{ name: 'Fred' }, { name: 'Harry' }];

    expect.hasAssertions();

    const { afs, app } = await setup(database);
    firebaseApp = app;

    const itemsCollection = afs.collection<Item>('items');
    const data = await itemsCollection.valueChanges().pipe(first()).toPromise();
    expect(data.length).toBe(2);
    expect(data).toEqual(expected);
  });

  // This works
  it('valueChanges({ idField: "customID" })', async () => {
    interface ItemWithId extends Item {
      customID: string;
    }

    const database: Database = {
      __items: {
        aaa: { name: 'Fred' },
        bbb: { name: 'Harry' },
      },
    };

    const expected: ItemWithId[] = [
      { customID: 'aaa', name: 'Fred' },
      { customID: 'bbb', name: 'Harry' },
    ];

    expect.hasAssertions();

    const { afs, app } = await setup(database);
    firebaseApp = app;
    const itemsCollection = afs.collection<Item>('items');

    const data = await itemsCollection
      .valueChanges({ idField: 'customID' })
      .pipe(first())
      .toPromise();
    expect(data.length).toBe(2);
    expect(data).toEqual(expected);
  });
});

const firestoreSet: SaveFunction = async (
  documentPath: string,
  objectToSave: object
) => {
  await adminApp.firestore().doc(documentPath).set(objectToSave);
};

const randomString = () => (Math.random() + 1).toString(36).split('.')[1];

export const rando = () =>
  [randomString(), randomString(), randomString()].join('');

async function setup(database?: { [key: string]: Collection<Object> }) {
  const aaaa = rando();

  TestBed.configureTestingModule({
    imports: [
      AngularFireModule.initializeApp(demoEnvironment.firebase.config, aaaa),
    ],
    /*    
    providers: [
      { provide: SETTINGS, useValue: { host: 'localhost:8080', ssl: false } },
    ],
*/
  });

  const app = TestBed.inject(FirebaseApp);
  app.auth().useEmulator('http://localhost:9099');
  app.firestore().useEmulator('localhost', 8080);

  const afs = TestBed.inject(AngularFirestore);

  // for admin SDK
  process.env['FIREBASE_AUTH_EMULATOR_HOST'] = 'localhost:9099';
  process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';

  adminApp = admin.initializeApp({ projectId: 'demo-1' }, aaaa);

  await clearFirestoreData();

  if (database) {
    await importDatabase(database, firestoreSet);
  }

  return { afs, app };
}

export async function clearFirestoreData(
  subCollections?: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>[]
) {
  const collections =
    subCollections ?? (await adminApp.firestore().listCollections());
  for (const coll of collections) {
    // Get a new write batch
    const batch = adminApp.firestore().batch();
    const documents = await coll.listDocuments();

    for (const doc of documents) {
      await clearFirestoreData(await doc.listCollections());
      batch.delete(doc);
    }
    await batch.commit();
  }
  return;
}
