export type Collection<T> = {
  [key: string]: T;
};

function omit(key: any, obj: any) {
  const { [key]: omitted, ...rest } = obj;
  return rest;
}

const isObject = (obj: any) => obj === Object(obj);

export function removeCollections(fields: Object) {
  let result = fields;

  for (const [field, v] of Object.entries(fields)) {
    if (isObject(v)) {
      result = omit(field, result);
    }
  }

  return result;
}

type SaveFunction = (documentPath: string, objectToSave: object) => void;

function processCollection(
  collectionPath: string,
  collection: Collection<Object>,
  saveFn: SaveFunction
) {
  for (const [document, fieldsOrCollections] of Object.entries(collection)) {
    const documentPath = `${collectionPath}/${document}`;

    const objectToSave = removeCollections(fieldsOrCollections);
    saveFn(documentPath, objectToSave);

    for (const [fieldName, v] of Object.entries(fieldsOrCollections)) {
      if (isObject(v)) {
        processCollection(`${documentPath}/${fieldName}`, v, saveFn);
      }
    }
  }
}

export function importDatabase(
  database: {
    [key: string]: Collection<Object>;
  },
  saveFn: SaveFunction
) {
  for (const [collectionName, collection] of Object.entries(database)) {
    processCollection(collectionName, collection, saveFn);
  }
}
