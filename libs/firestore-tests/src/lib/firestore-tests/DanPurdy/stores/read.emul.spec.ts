/**
 * @jest-environment node
 *
 * Required for Firebase
 */
import { setup, teardown } from '../helpers';
import { assertSucceeds } from '@firebase/rules-unit-testing';

describe('Stores read rules', () => {
  describe('list', () => {
    afterAll(async () => {
      await teardown();
    });

    test('succeed when a non authenticated user tries to get a list of all stores', async () => {
      const db = await setup(null, {
        'stores/ST01': {
          name: 'test1',
        },
        'stores/ST02': {
          name: 'test2',
        },
      });
      const ref = db.collection('stores');

      expect(await assertSucceeds(ref.get()));
    });

    test('succeed when a authenticated user tries to load a list of stores', async () => {
      const db = await setup(
        {
          uid: 'user',
        },
        {
          'stores/ST01': {
            name: 'test1',
          },
          'stores/ST02': {
            name: 'test2',
          },
        }
      );
      const ref = db.collection('stores');

      expect(await assertSucceeds(ref.doc('ST01').get()));
    });
  });

  describe('get', () => {
    afterAll(async () => {
      await teardown();
    });

    test('succeed when a non authenticated user tries to load a store', async () => {
      const db = await setup(null, {
        'stores/ST01': {
          name: 'test',
        },
      });
      const ref = db.collection('stores');

      expect(await assertSucceeds(ref.doc('ST01').get()));
    });

    test('succeed when a authenticated user tries to load a store', async () => {
      const db = await setup(
        {
          uid: 'user',
        },
        {
          'stores/ST01': {
            name: 'test',
          },
        }
      );
      const ref = db.collection('stores');

      expect(await assertSucceeds(ref.doc('ST01').get()));
    });
  });
});
