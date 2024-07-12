import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

onmessage = async function () {
  const result = await getUserData();
  postMessage(result);
}

const auth = getAuth()

const getUserData = async () => {

  const docRef = doc(db, "users", auth.currentUser.uid);
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    localStorage.setItem("user", JSON.stringify(docSnap.data()));
    return docSnap.data();
  } else {
    alert("❌ No such document user!");
  }
}