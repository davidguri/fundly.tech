import { Firestore } from "./firestore.controller";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";

import User from "../models/user.model";

import { validate } from "../utils/validate.util";

const auth = getAuth();
const currentUser: any = auth.currentUser;

// const provider = new GoogleAuthProvider();

export class Auth {
  static async signUp(userModel: User, password: string): Promise<void> {
    var uid = ""
    if (validate.email(userModel.email)) {
      await createUserWithEmailAndPassword(auth, userModel.email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          userModel.id = user.uid;
          await updateProfile(currentUser, {
            displayName: userModel.displayName,
            photoURL: userModel.photoUrl,
          }).then(() => {
            console.log('✅ Profile updated successfully');
          }).catch((error: any) => {
            console.error('❌ Error updating profile: ', error.message);
          })
        })
        .catch((error: any) => {
          throw new Error(error.message);
        });
      const userData: User = {
        id: userModel.id,
        email: userModel.email,
        displayName: userModel.displayName,
        photoUrl: userModel.photoUrl,
      };
      try {
        const docRef = await Firestore.addUserDocument(uid, userData)
        console.log("✅ Document written with ID: ", docRef.id);
      } catch (error: any) {
        throw new Error(error.message)
      };
    } else {
      console.error("❌ Email is not valid!")
    }
  }

  static async signIn(email: string, password: string): Promise<void> {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('✅ Signed in successfully: ', user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage)
      });
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
        throw new Error(error.message)
      })
  }
}