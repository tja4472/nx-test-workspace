import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LibraryFirebaseModule } from '@nx-test-workspace/library-firebase';
import { AppFirebaseModule } from './app-firebase.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppFirebaseModule, LibraryFirebaseModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
