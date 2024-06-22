import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import User from "../models/user.model";
import Transaction from "../models/transaction.model";

export class Firestore {
  static async addUserDocument(id: string, userData: User): Promise<any> {
    const docRef = await addDoc(collection(db, "users", id), userData);
    return docRef
  }

  static async addTransactionDocument(id: string, transactionData: Transaction): Promise<any> {
    return await addDoc(collection(db, "transactions", id), transactionData);
  }
}