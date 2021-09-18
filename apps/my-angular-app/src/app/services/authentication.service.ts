import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(public afAuth: AngularFireAuth) {}
  async createAccount(email: string, password: string) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      return !!result;
    } catch (e) {
      return false;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      return !!result;
    } catch (e) {
      return false;
    }
  }

  /*
  async signIn1(email: string, password: string) {
    try {
        console.log('aaaaaa');
      const result = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      return result;
    } catch (e) {
        console.log("[useAuth] signInWithEmailAndPassword failed!", e);
      throw e;
    }
  }
*/
  async signIn2(email: string, password: string) {
    const result = await this.afAuth.signInWithEmailAndPassword(
      email,
      password
    );
    return result;
  }

  async signIn1(email: string, password: string) {
    return await this.afAuth.signInWithEmailAndPassword(
      email,
      password
    );
  }  
}
