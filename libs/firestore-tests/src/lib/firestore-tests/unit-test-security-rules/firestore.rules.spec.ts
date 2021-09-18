/**
 * @jest-environment node
 *
 * Required for Firebase
 * 
 * @group emulator-required
 */
// Based on https://github.com/firebase/quickstart-testing

import { Collection, importDatabase } from '../../importDatabase';

import * as firebase from '@firebase/rules-unit-testing';
import * as fs from 'fs';


// projectId should match the project used by the emulator
// if you wish to use the Emulator UI.
const PROJECT_ID = 'demo-1';

const rules = fs.readFileSync(__dirname + '/firestore.rules', 'utf8');

firebase.useEmulators({ firestore: { host: 'localhost', port: 8080 } });

/**
 * Creates a new client FirebaseApp with authentication and returns the Firestore instance.
 */
function getAuthedFirestore(auth: any) {
  return firebase
    .initializeTestApp({ projectId: PROJECT_ID, auth })
    .firestore();
}

beforeEach(async () => {
  // Clear the database between tests
  await firebase.clearFirestoreData({ projectId: PROJECT_ID });
});

beforeAll(async () => {
  // Load the rules file before the tests begin
  const rules = fs.readFileSync(__dirname + '/firestore.rules', 'utf8');
  await firebase.loadFirestoreRules({ projectId: PROJECT_ID, rules });
});

afterAll(async () => {
  await Promise.all(firebase.apps().map((app) => app.delete()));
});

describe('My app', () => {
  it('require users to log in before creating a profile', async () => {
    const db = getAuthedFirestore(null);
    const profile = db.collection('users').doc('alice');
    await firebase.assertFails(profile.set({ birthday: 'January 1' }));
  });

  it('should enforce the createdAt date in user profiles', async () => {
    const db = getAuthedFirestore({ uid: 'alice' });
    const profile = db.collection('users').doc('alice');
    await firebase.assertFails(profile.set({ birthday: 'January 1' }));
    await firebase.assertSucceeds(
      profile.set({
        birthday: 'January 1',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
    );
  });

  it('should let anyone read any profile', async () => {
    const db = getAuthedFirestore(null);
    const profile = db.collection('users').doc('alice');
    await firebase.assertSucceeds(profile.get());
  });

  it('should let anyone create a room', async () => {
    const db = getAuthedFirestore({ uid: 'alice' });
    const room = db.collection('rooms').doc('firebase');
    await firebase.assertSucceeds(
      room.set({
        owner: 'alice',
        topic: 'All Things Firebase',
      })
    );
  });

  it('should force people to name themselves as room owner when creating a room', async () => {
    const db = getAuthedFirestore({ uid: 'alice' });
    const room = db.collection('rooms').doc('firebase');
    await firebase.assertFails(
      room.set({
        owner: 'scott',
        topic: 'Firebase Rocks!',
      })
    );
  });

  it('should not let one user steal a room from another user', async () => {
    const alice = getAuthedFirestore({ uid: 'alice' });
    const bob = getAuthedFirestore({ uid: 'bob' });

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
