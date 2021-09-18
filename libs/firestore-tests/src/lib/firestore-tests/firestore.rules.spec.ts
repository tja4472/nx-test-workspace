/**
 * @jest-environment node
 *
 * Required for Firebase
 * 
 * @group emulator-required
 */
import { Collection, importDatabase } from '../importDatabase';

// https://github.com/mn-pollinators/buzz-about/blob/master/firestore.rules
// https://github.com/firebase/quickstart-testing/blob/master/unit-test-security-rules/test/firestore.spec.js

// https://fireship.io/lessons/testing-firestore-security-rules-with-the-emulator/
// https://gist.github.com/katowulf/b5178664e7059928b4921fd85be922e5

import * as firebase from '@firebase/rules-unit-testing';
import * as fs from 'fs';

const seed = require('./seed.json') as SeedData;

interface SeedData {
  [key: string]: { [key: string]: any };
}

// projectId should match the project used by the emulator.
const projectId = 'demo-1';

// console.log('aaa>', __dirname);
// /home/tim/Documents/nx-test-workspace/libs/firestore-tests/src/lib/aaafirestore-tests

//const X = '/tim/Documents/nx-test-workspace/libs/firestore-tests/src/lib/aaafirestore-tests';
// const rules = fs.readFileSync(X + '/aaa', 'utf8');

// const rules = fs.readFileSync('firestore.test.rules', 'utf8');

const rules = fs.readFileSync(__dirname + '/firestore.test.rules', 'utf8');
const coverageUrl = `http://localhost:8080/emulator/v1/projects/${projectId}:ruleCoverage.html`;

const myId = 'user_abc';
const theirId = 'user_xyz';
const myAuth = { uid: myId, email: 'abc@gamil.com' };

/*
beforeAll(async () => {
    console.log('before all aaaaa')
    const emulatorSettings = await firebase.discoverEmulators();
    // firebase.useEmulators(emulatorSettings);
    firebase.useEmulators({ firestore: { host: 'localhost', port: 8080 } });

    console.log('Using emulators', emulatorSettings);
});
*/

firebase.useEmulators({ firestore: { host: 'localhost', port: 8080 } });

function getFirestore(auth: any) {
  return firebase.initializeTestApp({ projectId, auth }).firestore();
}

// initializeAdminApp ignores rules
function getAdminFirestore() {
  return firebase.initializeAdminApp({ projectId }).firestore();
}

type Item = {
  id: string;
  name: string;
  amount: number;
};

const items: Item[] = [
  { id: 'AA', name: 'nameA', amount: 1 },
  { id: 'BB', name: 'nameB', amount: 2 },
  { id: 'CC', name: 'nameC', amount: 3 },
];

type user = {
  name: string;
  favorites: {
    food: string;
    color: string;
    subject: string;
  };
  age: Number;
};

type Database = {
  __users: Collection<user>;
};

const Database: Database = {
  __users: {
    frank: {
      name: 'Frank',
      favorites: {
        food: 'Pizza',
        color: 'Blue',
        subject: 'Recess',
      },
      age: 12,
    },
  },
};

async function resetData() {
  //
  async function firestoreSet(documentPath: string, objectToSave: object) {
    await db.doc(documentPath).set(objectToSave);
  }

  await firebase.clearFirestoreData({ projectId });
  const db = firebase.initializeAdminApp({ projectId }).firestore();

  /*
  const promises = Object.entries(seed).map((entry) =>
    db.doc(entry[0]).set(entry[1])
  );
  await Promise.all(promises);

  const promisesA = items.map((item) => db.doc(`Items/${item.id}`).set(item));
  await Promise.all(promisesA);
*/

  // Create our initial doc
  importDatabase(Database, firestoreSet);
  /*
  await db
    .collection('users')
    .doc('frank')
    .set({
      name: 'Frank',
      favorites: {
        food: 'Pizza',
        color: 'Blue',
        subject: 'Recess',
      },
      age: 12,
    });
*/

  /*    
    .then(function () {
      console.log('Frank created');
    });
*/
}
// https://medium.com/swlh/using-firestore-with-typescript-65bd2a602945

beforeAll(async () => {
  console.log('before all aaaaa');
  // await resetData();
});

describe('test security rules', () => {
  beforeAll(async () => {
    // https://github.com/clement0010/sponsorr-backend/blob/master/src/test/db.ts
    // const emulatorSettings = await firebase.discoverEmulators();
    // console.log('Using emulators', emulatorSettings);

    // Load the content of the "firestore.rules" file into the emulator before running the
    // test suite. This is necessary because we are using a fake Project ID in the tests,
    // so the rules "hot reloading" behavior which works in the Web App does not apply here.
    await firebase.loadFirestoreRules({ projectId, rules });
  });

  beforeEach(async () => {
    console.log('beforeEach-1');
    // Clear the database between tests
    await firebase.clearFirestoreData({ projectId });
    await resetData();
  });
  /* ??
  afterEach(async () => {
    // Clear the database between tests
    await firebase.clearFirestoreData({ projectId });
  });
*/
  afterAll(async () => {
    await Promise.all(firebase.apps().map((app) => app.delete()));
    // await firebase.clearFirestoreData({ projectId });
    console.log(`View rule coverage information at ${coverageUrl}\n`);
  });

  it('should create the app', () => {
    expect(true).toBeTruthy();
  });

  it('require users to log in before creating a profile', async () => {
    // firebase.initializeTestApp({ projectId, auth: { uid: "alice", email: "alice@example.com" }});
    const db = getFirestore(null);
    const profile = db.collection('users').doc('alice');
    await firebase.assertFails(profile.set({ birthday: 'January 1' }));
  });

  it('should enforce the createdAt date in user profiles', async () => {
    const db = getFirestore({ uid: 'alice' });
    const profile = db.collection('users').doc('alice');
    await firebase.assertFails(profile.set({ birthday: 'January 1' }));
    await firebase.assertSucceeds(
      profile.set({
        birthday: 'January 1',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
    );
  });

  it('should only let users create their own profile', async () => {
    const db = getFirestore({ uid: 'alice' });
    await firebase.assertSucceeds(
      db.collection('users').doc('alice').set({
        birthday: 'January 1',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
    );

    await firebase.assertFails(
      db.collection('users').doc('bob').set({
        birthday: 'January 1',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
    );
  });

  it('should let anyone read any profile', async () => {
    const db = getFirestore(null);
    const profile = db.collection('users').doc('alice');
    await firebase.assertSucceeds(profile.get());
  });

  it('should let anyone create a room', async () => {
    const db = getFirestore({ uid: 'alice' });
    const room = db.collection('rooms').doc('firebase');
    await firebase.assertSucceeds(
      room.set({
        owner: 'alice',
        topic: 'All Things Firebase',
      })
    );
  });

  it('should force people to name themselves as room owner when creating a room', async () => {
    const db = getFirestore({ uid: 'alice' });
    const room = db.collection('rooms').doc('firebase');
    await firebase.assertFails(
      room.set({
        owner: 'scott',
        topic: 'Firebase Rocks!',
      })
    );
  });

  it('should not let one user steal a room from another user', async () => {
    const alice = getFirestore({ uid: 'alice' });
    const bob = getFirestore({ uid: 'bob' });

    await firebase.assertSucceeds(
      bob.collection('rooms').doc('snow').set({
        owner: 'bob',
        topic: 'All Things Snowboarding',
      })
    );

    await firebase.assertFails(
      alice.collection('rooms').doc('snow').set({
        owner: 'alice',
        topic: 'skiing > snowboarding',
      })
    );
  });
});

// https://firebaseonair.withgoogle.com/events/firebase-live20/watch?talk=security-rules-with-emulator-suite
describe('Unit testing security rules with the new Firebase emulator suite.', () => {
  beforeAll(async () => {
    await firebase.loadFirestoreRules({ projectId, rules });
  });

  beforeEach(async () => {
    // Clear the database between tests
    await firebase.clearFirestoreData({ projectId });
  });

  // =============================
  it('Can read a single public post', async () => {
    const admin = getAdminFirestore();
    const postId = 'public_post';
    const setupDoc = admin.collection('aposts').doc(postId);
    await setupDoc.set({ authorId: theirId, visibility: 'public' });

    const db = getFirestore(null);
    const testRead = db.collection('aposts').doc(postId);
    await firebase.assertSucceeds(testRead.get());
  });

  it('Can read a private post belonging to the user', async () => {
    const admin = getAdminFirestore();
    const postId = 'private_post';
    const setupDoc = admin.collection('aposts').doc(postId);
    await setupDoc.set({ authorId: myId, visibility: 'private' });

    const db = getFirestore(myAuth);
    const testRead = db.collection('aposts').doc(postId);
    await firebase.assertSucceeds(testRead.get());
  });

  it(`Can't read a private post belonging to another user`, async () => {
    const admin = getAdminFirestore();
    const postId = 'private_post';
    const setupDoc = admin.collection('aposts').doc(postId);
    await setupDoc.set({ authorId: theirId, visibility: 'private' });

    const db = getFirestore(myAuth);
    const testRead = db.collection('aposts').doc(postId);
    await firebase.assertFails(testRead.get());
  });
});

/*
  it('require users to log in before creating a profile', async () => {
  });
*/
// https://github.com/firebase/quickstart-nodejs/blob/master/firestore-emulator/typescript-quickstart/test/test.ts
// https://firebase.google.com/docs/firestore/security/insecure-rules?authuser=0
