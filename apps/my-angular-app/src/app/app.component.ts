import { Component } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { Observable } from 'rxjs';

export interface Item {
  id: string;
  name: string;
}

@Component({
  selector: 'nx-test-workspace-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'my-angular-app';

  private itemsCollection: AngularFirestoreCollection<Item> | undefined;
  items: Observable<Item[]> | undefined;

  constructor(public auth: AngularFireAuth, private afs: AngularFirestore) {}

  startListening() {
    this.itemsCollection = this.afs.collection<Item>('items');
    this.items = this.itemsCollection.valueChanges();
  }

  addItem() {
    console.log('## addItem');

    if (this.itemsCollection === undefined) {
      return;
    }

    const item: Item = {
      id: 'Added using add',
      name: Math.random().toString(),
    };
    this.itemsCollection.add(item).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('errorCode>', errorCode);
      console.error('errorMessage>', errorMessage);
    });
  }

  addItemSet() {
    console.log('## addItemSet');

    if (this.itemsCollection === undefined) {
      return;
    }

    // Persist a document id
    const id = this.afs.createId();
    const item: Item = { id, name: Math.random().toString() };
    this.itemsCollection
      .doc(id)
      .set(item)
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('errorCode>', errorCode);
        console.error('errorMessage>', errorMessage);
      });
  }

  signInAnonymously() {
    console.log('## signInAnonymously');
    this.auth.signInAnonymously().catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('errorCode>', errorCode);
      console.error('errorMessage>', errorMessage);
    });
  }  
}
