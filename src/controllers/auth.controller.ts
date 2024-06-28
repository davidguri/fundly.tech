import { Firestore } from "./firestore.controller";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, setPersistence, browserLocalPersistence } from "firebase/auth";

import User from "../models/user.model";

import { validate } from "../utils/validate.util";

const auth = getAuth();
const currentUser: any = auth.currentUser;

export class Auth {
  static async signUp(userModel: User, password: string): Promise<void> {
    let uid = ""
    if (validate.email(userModel.email)) {
      setPersistence(auth, browserLocalPersistence)
        .then(async () => {
          return await createUserWithEmailAndPassword(auth, userModel.email, password)
            .then(async () => {
              uid = auth.currentUser.uid;
              await updateProfile(currentUser, {
                displayName: userModel.displayName,
                photoURL: userModel.photoUrl,
              }).then(() => {
                console.log('✅ Profile updated successfully');
              }).catch((error: any) => {
                alert('❌ Error updating profile: ' + error.message);
              })
            })
            .catch((error: any) => {
              alert(error.message);
            });
        })
      const userData: User = {
        id: uid,
        email: userModel.email,
        displayName: userModel.displayName,
        photoUrl: userModel.photoUrl,
      };
      try {
        const docRef = await Firestore.addUserDocument(userModel.id, userData)
        console.log("✅ Document written with ID: ", docRef.id);
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
}