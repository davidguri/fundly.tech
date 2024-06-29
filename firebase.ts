import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCxqS90OxkLQr8XtNR45K_Z3BRUfWRmVFQ",
  authDomain: "legera-2cba9.firebaseapp.com",
  projectId: "legera-2cba9",
  storageBucket: "legera-2cba9.appspot.com",
  messagingSenderId: "208535729589",
  appId: "1:208535729589:web:23f74feb8a6e23aa9195fc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage();
const db = getFirestore(app);

export { auth, db };