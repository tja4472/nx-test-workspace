import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppFirebaseModule } from './firebase/app-firebase.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppFirebaseModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
