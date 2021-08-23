import { getGreeting, getHello, navigateTo } from '../support/po';
import { login, logout } from '../support/utils';
import { Collection, importDatabase } from '@nx-test-workspace/firestore-tests';

function firestoreSet(documentPath: string, objectToSave: object) {
  // await dbFirestore.doc(documentPath).set(objectToSave);
  cy.callFirestore('set', documentPath, objectToSave);
}

type Item = {
  name: string;
};

type Database = {
  __items: Collection<Item>;
};

const Database: Database = {
  __items: {
    item1: {
      name: 'XXXX',
    },
    item2: {
      name: 'XXXX',
    },
  },
};

describe('firestore test', () => {
  before(() => {
    // runs once before the first test in this block

    // Remove all Firestore data from items collection.
    const opts = { recursive: true };
    cy.callFirestore('delete', 'items', opts);
    // import database.l
    importDatabase(Database, firestoreSet);
  });

  after(() => {
    // runs once after the last test in this block
    logout();
    // removeOldFirebaseData();
  });

  beforeEach(() => {
    // runs once before each test.
    login();
  });

  afterEach(() => {
    // runs once before each test.
    logout();
  });

  it('test 1', () => {
    cy.visit('/');
    getGreeting().contains('Welcome to');
  });

  it('test 2', () => {
    cy.visit('/');
    getGreeting().contains('Welcome to');
  });
});
