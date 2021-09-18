/**
 * @jest-environment node
 *
 * Required for Firebase
 * 
 * @group emulator-required
 */

import * as firebase from '@firebase/rules-unit-testing';
import { stringify } from 'node:querystring';
// import * as fs from 'fs';

import { Collection, importDatabase } from './importDatabase';

// projectId should match the project used by the emulator.
const projectId = 'demo-1';

firebase.useEmulators({ firestore: { host: 'localhost', port: 8080 } });
// initializeAdminApp ignores rules
function getAdminFirestore() {
  return firebase.initializeAdminApp({ projectId }).firestore();
}

describe('test1', () => {
  type DocumentC = {
    doc_C_field1: string;
    doc_C_field2: number;
  };

  type DocumentD = {
    doc_D_field1: string;
    doc_D_field2: number;
  };

  type DocumentA = {
    doc_A_field1: string;
    doc_A_field2: number;
    __doc_A_collectionC: Collection<DocumentC>;
    __doc_A_collectionD: Collection<DocumentD>;
  };

  type Favorites = {
    food: string;
    color: string;
    subject: string;
  };

  type DocumentB = {
    doc_B_field1: string;
    doc_B_field2: number;
    favorites: Favorites;
  };

  type Database = {
    __collectionA: Collection<DocumentA>;
    __collectionB: Collection<DocumentB>;
  };

  const Database: Database = {
    __collectionA: {
      documentA1: {
        doc_A_field1: 'field1-A1',
        doc_A_field2: 2,
        __doc_A_collectionC: {
          documentC1: {
            doc_C_field1: 'docC_field1-C1',
            doc_C_field2: 6,
          },
          documentC2: {
            doc_C_field1: 'docC_field1-C2',
            doc_C_field2: 6,
          },
        },
        __doc_A_collectionD: {
          documentD1: {
            doc_D_field1: 'docD_field1-D1',
            doc_D_field2: 6,
          },
        },
      },
      documentA2: {
        doc_A_field1: 'field1-A2',
        doc_A_field2: 2,
        __doc_A_collectionC: {},
        __doc_A_collectionD: {},
      },
      documentA3: {
        doc_A_field1: 'field1-A3',
        doc_A_field2: 2,
        __doc_A_collectionC: {},
        __doc_A_collectionD: {},
      },
    },
    __collectionB: {
      documentB1: {
        doc_B_field1: 'field1-B1',
        doc_B_field2: 2,
        favorites: {
          food: 'Pizza',
          color: 'Blue',
          subject: 'Recess',
        },
      },
    },
  };

  let dbFirestore: FirebaseFirestore.Firestore;

  async function firestoreSet(documentPath: string, objectToSave: object) {
    // console.log('objectToSave>', objectToSave);
    await dbFirestore.doc(documentPath).set(objectToSave);
  }

  it('import Firestore', async () => {
    await firebase.clearFirestoreData({ projectId });

    dbFirestore = firebase.initializeAdminApp({ projectId }).firestore();
    importDatabase(Database, firestoreSet);
  });
});
