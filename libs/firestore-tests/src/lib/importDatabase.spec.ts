/**
 * @jest-environment node
 *
 * Required for Firebase
 */
import {
  Collection,
  importDatabase,
  removeCollections,
} from './importDatabase';

type DocumentD = {
    D_field1: string;
    D_field2: number;
  };

type DocumentC = {
  doc_C_field1: string;
  doc_C_field2: number;
};

type DocumentA = {
  doc_A_field1: string;
  doc_A_field2: number;
  doc_A_collectionC: Collection<DocumentC>;
  doc_A_collectionD: Collection<DocumentD>;
};

// ## DocumentC1 ##
const DocumentC1: DocumentC = {
  doc_C_field1: 'docC_field1_1',
  doc_C_field2: 6,
};

const expectedDocumentC1 = removeCollections(DocumentC1);

const DocumentC1Path = 'collectionA/documentA1/doc_A_collectionC/documentC1';

// ## DocumentA1 ##
const DocumentA1: DocumentA = {
  doc_A_field1: 'field1-A1',
  doc_A_field2: 1,
  doc_A_collectionC: { documentC1: DocumentC1 },
  doc_A_collectionD: {},
};

const expectedDocumentA1 = removeCollections(DocumentA1);

const DocumentA1Path = 'collectionA/documentA1';

// ## DocumentA2 ##
const DocumentA2: DocumentA = {
  doc_A_field1: 'field1-A2',
  doc_A_field2: 2,
  doc_A_collectionC: {},
  doc_A_collectionD: {},
};

const expectedDocumentA2 = removeCollections(DocumentA2);

const DocumentA2Path = 'collectionA/documentA2';

// ## DatabaseData ##
const DatabaseData = {
  collectionA: {
    documentA1: DocumentA1,
    documentA2: DocumentA2,
  },
};

describe('test1', () => {
  it('1 collection with 2 documents', async () => {
    const mockSaveFn = jest.fn();
    importDatabase(DatabaseData, mockSaveFn);
    expect(mockSaveFn.mock.calls.length).toBe(3);

    // call: 1
    expect(mockSaveFn.mock.calls[0][0]).toBe(DocumentA1Path);
    expect(mockSaveFn.mock.calls[0][1]).toStrictEqual(expectedDocumentA1);

    // call: 2
    expect(mockSaveFn.mock.calls[1][0]).toBe(DocumentC1Path);
    expect(mockSaveFn.mock.calls[1][1]).toStrictEqual(expectedDocumentC1);

    // call: 3
    expect(mockSaveFn.mock.calls[2][0]).toBe(DocumentA2Path);
    expect(mockSaveFn.mock.calls[2][1]).toStrictEqual(expectedDocumentA2);
  });
});
