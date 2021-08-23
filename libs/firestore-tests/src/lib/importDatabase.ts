export type Collection<T> = {
  [key: string]: T;
};

function omit(key: any, obj: any) {
  const { [key]: omitted, ...rest } = obj;
  return rest;
}

const isObject = (obj: any) => obj === Object(obj);

function isCollection(fieldName: string): boolean {
  return fieldName.substr(0, 2) === '__';
}

export function removeCollections(fields: Object) {
  let result = fields;

  for (const [field, v] of Object.entries(fields)) {
    // console.log('A>', field);

    if (isCollection(field)) {
      result = omit(field, result);
    }
  }

  return result;
}

type SaveFunction = (documentPath: string, objectToSave: object) => void;

function processCollection(
  parentPath: string,
  collectionName: string,
  collection: Collection<Object>,
  saveFn: SaveFunction
) {
  const dbCollectionName = collectionName.substr(2);

  for (const [document, fieldsOrCollections] of Object.entries(collection)) {
    const documentPath = `${dbCollectionName}/${document}`;

    const objectToSave = removeCollections(fieldsOrCollections);
    saveFn(`${parentPath}/${documentPath}`, objectToSave);

    for (const [fieldName, v] of Object.entries(fieldsOrCollections)) {
      if (isCollection(fieldName)) {
        processCollection(
          `${parentPath}/${documentPath}`,
          fieldName,
          v,
          saveFn
        );
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
    processCollection('', collectionName, collection, saveFn);
  }
}
