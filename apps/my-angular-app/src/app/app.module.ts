import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppFirebaseModule } from './app-firebase.module';
import { AppFirebaseModule as LibraryFirebaseModule } from '@nx-test-workspace/app-firebase';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppFirebaseModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
