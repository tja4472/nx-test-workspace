/**
 * @jest-environment node
 *
 * Required for Firebase
 *
 * @group emulator-required
 */
import { setup, teardown } from '../helpers';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';

describe('Store update rules', () => {
  afterAll(async () => {
    await teardown();
  });

  test('fail when a non authenticated user tries to update a store record', async () => {
    const db = await setup(null, {
      'stores/ST00': {
        name: 'test',
      },
    });

    expect(
      await assertFails(
        db.collection('stores').doc('ST00').set({ name: 'updated' })
      )
    );
  });

  test('fail when an authenticated user with no stores tries to update a store record', async () => {
    const db = await setup(
      { uid: 'test' },
      {
        'stores/ST00': {
          name: 'test',
        },
      }
    );

    expect(
      await assertFails(
        db.collection('stores').doc('ST00').set({ name: 'updated' })
      )
    );
  });

  test('fail when an authenticated user from another store tries to update a different store record', async () => {
    const db = await setup(
      { uid: 'test', stores: ['ST01'] },
      {
        'stores/ST00': {
          name: 'test',
        },
      }
    );

    expect(
      await assertFails(
        db.collection('stores').doc('ST00').set({ name: 'updated' })
      )
    );
  });

  test('succeed when an authenticated user tries to update a store record to which they have access', async () => {
    const db = await setup(
      { uid: 'test', stores: ['ST00'] },
      {
        'stores/ST00': {
          name: 'test',
        },
      }
    );

    expect(
      await assertSucceeds(
        db.collection('stores').doc('ST00').set({ name: 'updated' })
      )
    );
  });
});
