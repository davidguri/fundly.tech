import { getAuth } from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

self.onmessage = function () {
  const result = getUserData();
  self.postMessage(result);
};

const auth = getAuth()

const getUserData = async () => {

  const docRef = doc(db, "users", auth.currentUser.uid);
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    alert("❌ No such document user!");
  }
}