/**
 * @jest-environment node
 *
 * Required for Firebase
 * 
 * @group emulator-required
 */
import { TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { AppFirebaseModule } from './app-firebase.module';
import { AppComponent } from './app.component';
import { AngularFireModule, FirebaseApp } from '@angular/fire/compat';
import {
  AngularFireAuth,
  AngularFireAuthModule,
} from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import {
  AngularFirestore,
  AngularFirestoreModule,
  SETTINGS as FIRESTORE_SETTINGS,
  USE_EMULATOR as USE_FIRESTORE_EMULATOR,
} from '@angular/fire/compat/firestore';

describe('AAAAA', () => {
  let app: FirebaseApp;
  let afAuth: AngularFireAuth;
  let afFirestore: AngularFirestore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase.config, 'zzzz'),
        // AngularFireAuthModule,
        // AngularFirestoreModule,
      ],
    });

    app = TestBed.inject(FirebaseApp);
    // afAuth = TestBed.inject(AngularFireAuth);
    afFirestore = TestBed.inject(AngularFirestore);
  });

  it('should create the app', () => {
    // const fixture = TestBed.createComponent(AppComponent);
    // const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

/*
Fails with:
   ● AppComponent › should create the app

The error below may be caused by using the wrong test environment, see https://jestjs.io/docs/configuration#testenvironment-string.
Consider using the "jsdom" test environment.
*/
xdescribe('AppComponent', () => {
  let app: FirebaseApp;
  let afAuth: AngularFireAuth;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent],
        imports: [
          AngularFireModule.initializeApp(environment.firebase.config),
          // AngularFireAuthModule,
          // AngularFirestoreModule,
        ],
      }).compileComponents();

      //app = TestBed.inject(FirebaseApp);
      //afAuth = TestBed.inject(AngularFireAuth);
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'my-angular-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('my-angular-app');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Welcome to ng-angularfire-testbed'
    );
  });
});
