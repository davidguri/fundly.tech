import { Firestore } from "./firestore.controller";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";

import User from "../models/user.model";

import { validate } from "../utils/validate.util";

const auth = getAuth();

export class Auth {
  static async signUp(userModel: User, password: string, displayName: string, photoUrl: string): Promise<void> {
    let uid: string
    if (validate.email(userModel.email)) {
      await createUserWithEmailAndPassword(auth, userModel.email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          uid = user.uid;
          await updateProfile(auth.currentUser, {
            displayName: displayName,
            photoURL: photoUrl,
          }).then(() => {
            console.log('✅ Profile updated successfully');
          }).catch((error: any) => {
            alert('❌ Error updating profile: ' + error.message);
          })
        })
        .catch((error: any) => {
          alert(error.message);
        });
      const userData: User = {
        id: uid,
        role: userModel.role,
        email: userModel.email,
        displayName: userModel.displayName,
        photoUrl: userModel.photoUrl,
        currency: userModel.currency,
      };
      try {
        const docRef = await Firestore.addUserDocument(uid, userData)
        console.log("✅ Document written with ID: ", docRef);
      } catch (error: any) {
        alert(error.message)
      };
    } else {
      alert("❌ Email is not valid!")
    }
  }

  static async signIn(email: string, password: string): Promise<void> {
    setPersistence(auth, browserLocalPersistence)
      .then(async () => {
        return await signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log('✅ Signed in successfully: ', user);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`${errorCode} ${errorMessage}`)
          });
      })
  }

  static async signInGoogle(): Promise<void> {
    // TODO: wtf is this
  }

  static async signOut(): Promise<void> {
    await signOut(auth)
      .then(() => {
        console.log('✅ Signed out successfully: ')
      })
      .catch((error: any) => {
        alert(error.message)
      })
  }

  static getUserData(): any {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        return user
      } else {
        return null
      }
    })
  }
}