import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/compat/auth';
import {
  AngularFirestoreModule,
  SETTINGS as FIRESTORE_SETTINGS,
  USE_EMULATOR as USE_FIRESTORE_EMULATOR,
} from '@angular/fire/compat/firestore';

import { environment } from '../environments/environment';

// experimentalForceLongPolling required for Cypress testing.
// Cannot connect to Firestore emulator
// https://github.com/cypress-io/cypress/issues/6350#issuecomment-587708852

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase.config),
    // AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  // exports: [AngularFireModule, AngularFireAuthModule],
  // providers: [ScreenTrackingService, UserTrackingService],

/*  
  providers: [
    // ... Existing Providers
    { provide: USE_AUTH_EMULATOR, useValue: ['http://localhost:9099'] },    
    { provide: USE_FIRESTORE_EMULATOR, useValue:  ['localhost', 8080]  },
  ] 
*/  
  
  providers: [
    {
      provide: FIRESTORE_SETTINGS,
      useValue: { experimentalAutoDetectLongPolling: true },
    },
    {
      provide: USE_AUTH_EMULATOR,
      useValue: environment.firebase.emulators?.auth,
    },
    {
      provide: USE_FIRESTORE_EMULATOR,
      useValue: environment.firebase.emulators?.firestore,
    },
  ],
 
})
export class AppFirebaseModule {}
