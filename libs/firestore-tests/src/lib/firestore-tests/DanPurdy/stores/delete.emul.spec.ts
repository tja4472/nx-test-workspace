/**
 * @jest-environment node
 *
 * Required for Firebase
 *
 * @group emulator-required
 */
import { setup, teardown } from '../helpers';
import { assertFails } from '@firebase/rules-unit-testing';

describe('Store delete rules', () => {
  afterAll(async () => {
    await teardown();
  });

  test('fail when a non authenticated user tries to delete a store record', async () => {
    const db = await setup(null, {
      'stores/ST00': {
        name: 'test',
      },
    });

    expect(await assertFails(db.collection('stores').doc('ST00').delete()));
  });

  test('fail when an authenticated user tries to delete a store record', async () => {
    const db = await setup(
      { uid: 'test' },
      {
        'stores/ST00': {
          name: 'test',
        },
      }
    );

    expect(await assertFails(db.collection('stores').doc('ST00').delete()));
  });
});
