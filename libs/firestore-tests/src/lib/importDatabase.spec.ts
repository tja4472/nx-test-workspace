/**
 * @jest-environment node
 *
 * Required for Firebase
 */
import { Collection, importDatabase } from './importDatabase';

type DocumentA = {
  doc_A_field1: string;
  doc_A_field2: number;
  doc_A_collectionC: Collection<DocumentC>;
  doc_A_collectionD: Collection<DocumentD>;
};

type DocumentB = {
  doc_B_field1: string;
  doc_B_field2: number;
};

type DocumentC = {
  doc_C_field1: string;
  doc_C_field2: number;
};

type DocumentD = {
  doc_D_field1: string;
  doc_D_field2: number;
};

type Database = {
  collectionA: Collection<DocumentA>;
  collectionB: Collection<DocumentB>;
};

const Database: Database = {
  collectionA: {
    documentA1: {
      doc_A_field1: 'field1-A1',
      doc_A_field2: 2,
      doc_A_collectionC: {
        documentC1: {
          doc_C_field1: 'docC_field1-C1',
          doc_C_field2: 6,
        },
        documentC2: {
          doc_C_field1: 'docC_field1-C2',
          doc_C_field2: 6,
        },
      },
      doc_A_collectionD: {
        documentD1: {
          doc_D_field1: 'docD_field1-D1',
          doc_D_field2: 6,
        },
      },
    },
    documentA2: {
      doc_A_field1: 'field1-A2',
      doc_A_field2: 2,
      doc_A_collectionC: {},
      doc_A_collectionD: {},
    },
    documentA3: {
      doc_A_field1: 'field1-A3',
      doc_A_field2: 2,
      doc_A_collectionC: {},
      doc_A_collectionD: {},
    },
  },
  collectionB: {
    documentB1: {
      doc_B_field1: 'field1-B1',
      doc_B_field2: 2,
    },
  },
};

describe('test1', () => {
  it('test database', async () => {
    const mockSaveFn = jest.fn();
    importDatabase(Database, mockSaveFn);
    expect(mockSaveFn.mock.calls.length).toBe(7);

    {
      const call = 0;
      const path = 'collectionA/documentA1';
      const expected: Omit<
        DocumentA,
        'doc_A_collectionC' | 'doc_A_collectionD'
      > = {
        doc_A_field1: 'field1-A1',
        doc_A_field2: 2,
      };

      expect(mockSaveFn.mock.calls[call][0]).toBe(path);
      expect(mockSaveFn.mock.calls[call][1]).toStrictEqual(expected);
    }
    {
      const call = 1;
      const path = 'collectionA/documentA1/doc_A_collectionC/documentC1';
      const expected: DocumentC = {
        doc_C_field1: 'docC_field1-C1',
        doc_C_field2: 6,
      };
      expect(mockSaveFn.mock.calls[call][0]).toBe(path);
      expect(mockSaveFn.mock.calls[call][1]).toStrictEqual(expected);
    }
    {
      const call = 2;
      const path = 'collectionA/documentA1/doc_A_collectionC/documentC2';
      const expected: DocumentC = {
        doc_C_field1: 'docC_field1-C2',
        doc_C_field2: 6,
      };
      expect(mockSaveFn.mock.calls[call][0]).toBe(path);
      expect(mockSaveFn.mock.calls[call][1]).toStrictEqual(expected);
    }
    {
      const call = 3;
      const path = 'collectionA/documentA1/doc_A_collectionD/documentD1';
      const expected: DocumentD = {
        doc_D_field1: 'docD_field1-D1',
        doc_D_field2: 6,
      };
      expect(mockSaveFn.mock.calls[call][0]).toBe(path);
      expect(mockSaveFn.mock.calls[call][1]).toStrictEqual(expected);
    }
    {
      const call = 4;
      const path = 'collectionA/documentA2';
      const expected: Omit<
        DocumentA,
        'doc_A_collectionC' | 'doc_A_collectionD'
      > = {
        doc_A_field1: 'field1-A2',
        doc_A_field2: 2,
      };

      expect(mockSaveFn.mock.calls[call][0]).toBe(path);
      expect(mockSaveFn.mock.calls[call][1]).toStrictEqual(expected);
    }
    {
      const call = 5;
      const path = 'collectionA/documentA3';
      const expected: Omit<
        DocumentA,
        'doc_A_collectionC' | 'doc_A_collectionD'
      > = {
        doc_A_field1: 'field1-A3',
        doc_A_field2: 2,
      };

      expect(mockSaveFn.mock.calls[call][0]).toBe(path);
      expect(mockSaveFn.mock.calls[call][1]).toStrictEqual(expected);
    }
    {
      const call = 6;
      const path = 'collectionB/documentB1';
      const expected: DocumentB = {
        doc_B_field1: 'field1-B1',
        doc_B_field2: 2,
      };

      expect(mockSaveFn.mock.calls[call][0]).toBe(path);
      expect(mockSaveFn.mock.calls[call][1]).toStrictEqual(expected);
    }
  });
});
