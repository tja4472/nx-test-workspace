import {
  apps,
  clearFirestoreData,
  initializeTestApp,
  loadFirestoreRules,
  useEmulators,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';

export async function setup(auth: any = undefined, data: any = undefined) {
  // projectId should match the project used by the emulator
  // if you wish to use the Emulator UI.
  const PROJECT_ID = 'demo-1';

  useEmulators({ firestore: { host: 'localhost', port: 8080 } });

  const app = await initializeTestApp({
    projectId: PROJECT_ID,
    auth,
  });

  const db = app.firestore();

  await clearFirestoreData({ projectId: PROJECT_ID });

  // Apply the test rules so we can write documents without needing the admin app
  await loadFirestoreRules({
    projectId: PROJECT_ID,
    rules: readFileSync(__dirname + '/firestore-test.rules', 'utf8'),
  });

  // Write mock documents before rules
  if (data) {
    for (const key in data) {
      const ref = db.doc(key);
      await ref.set(data[key]);
    }
  }

  // Apply rules
  await loadFirestoreRules({
    projectId: PROJECT_ID,
    rules: readFileSync(__dirname + '/firestore.rules', 'utf8'),
  });

  return db;
}

export async function teardown() {
  Promise.all(apps().map((app) => app.delete()));
}
