import { collection, addDoc, DocumentReference, setDoc, doc, getDocs, query, where, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import User from "../models/user.model";
import Transaction from "../models/transaction.model";

export class Firestore {
  static async addUserDocument(id: string, userData: User): Promise<DocumentReference> {
    const docRef = await addDoc(collection(db, "users", id), userData);
    return docRef
  }

  static async getUserById(id: string): Promise<any> {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
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
}