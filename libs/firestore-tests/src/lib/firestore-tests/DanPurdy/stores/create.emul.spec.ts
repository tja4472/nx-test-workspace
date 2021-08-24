/**
 * @jest-environment node
 *
 * Required for Firebase
 */
import { setup, teardown } from '../helpers';
import { assertFails } from '@firebase/rules-unit-testing';

describe('Store create rules', () => {
  afterAll(async () => {
    await teardown();
  });

  test('fail when a non authenticated user tries to create a store record', async () => {
    const db = await setup();

    expect(await assertFails(db.collection('stores').add({ name: 'test' })));
  });

  test('fail when a non authenticated user tries to create a store record', async () => {
    const db = await setup();

    expect(
      await assertFails(
        db.collection('stores').doc('test').set({ name: 'teegst' })
      )
    );
  });

  test('fail when an authenticated user tries to create another store record with a random uid', async () => {
    const db = await setup({ uid: 'test' });

    expect(await assertFails(db.collection('stores').add({ name: 'teegst' })));
  });

  test('fail when an authenticated user tries to create a non random uid store record', async () => {
    const db = await setup({ uid: 'test' });

    expect(
      await assertFails(
        db.collection('stores').doc('ST00').set({ name: 'teegst' })
      )
    );
  });
});
