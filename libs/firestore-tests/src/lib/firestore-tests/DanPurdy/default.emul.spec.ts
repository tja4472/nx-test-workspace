/**
 * @jest-environment node
 *
 * Required for Firebase
 */
import { setup, teardown } from './helpers';
import { assertFails } from '@firebase/rules-unit-testing';

// firebase is now declared & loaded in the global types.
export type Firestore = firebase.default.firestore.Firestore;
export type CollectionReference =
  firebase.default.firestore.CollectionReference;

describe('Default firestore rules', () => {
  let db: Firestore;
  let ref: CollectionReference;

  beforeAll(async () => {
    db = await setup();
    ref = db.collection('non-existsent-collection');
  });

  afterAll(async () => {
    await teardown();
  });

  test('fail when trying to read from an unauthorised store', async () => {
    expect(await assertFails(ref.get()));
  });

  test('fail when trying to write to an unauthorised store', async () => {
    expect(await assertFails(ref.add({})));
  });
});
