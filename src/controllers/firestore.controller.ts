import { collection, getDoc, setDoc, doc, getDocs, query, where, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import User from "../models/user.model";
import Transaction from "../models/transaction.model";

export class Firestore {
  static async addUserDocument(id: string, userData: User): Promise<any> {
    await setDoc(doc(db, "users", id), userData);
  }

  static async getUserById(id: string) {
    // const q = query(collection(db, "users", id));

    // const querySnapshot = await getDocs(q);
    // const data = querySnapshot.docs.map(doc => ({
    //   id: doc.id,
    //   ...doc.data()
    // }))

    // return data

    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  static async updateUserData(id: string, userData: User): Promise<any> {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, userData);
  }

  static async addTransactionDocument(id: string, transactionData: Transaction): Promise<any> {
    const docRef = await setDoc(doc(db, "transactions", id), transactionData);
    return docRef
  }

  static async getTransactions(userId: string): Promise<any> {
    const q = query(collection(db, "transactions"), where("userId", "==", userId));

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return data
  }

  static async deleteTransaction(id: string): Promise<any> {
    await deleteDoc(doc(db, "transactions", id))
  }
}