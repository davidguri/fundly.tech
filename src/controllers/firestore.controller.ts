import {
  collection,
  getDoc,
  setDoc,
  doc,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../firebase";
import User from "../models/user.model";
import Transaction from "../models/transaction.model";

export class Firestore {
  static async addUserDocument(id: string, userData: User): Promise<any> {
    await setDoc(doc(db, "users", id), userData);
    if (userData.role === "Owner") {
      await setDoc(doc(db, "businesses", userData.business), {
        businessName: userData.business,
        owner: userData.id,
        workers: [],
      });
    } else if (userData.role === "Freelance") {
      await setDoc(doc(db, "businesses", userData.business), {
        businessName: userData.business,
        owner: userData.id,
      });
    } else if (userData.role === "Worker") {
      const businessRef = doc(db, "businesses", userData.business);
      await updateDoc(businessRef, {
        workers: arrayUnion(userData.id),
      });
    }
  }

  static async getUserById(id: string) {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      alert("❌ No such document user!");
    }
  }

  static async updateUserData(id: string, userData: User): Promise<any> {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, userData);
  }

  static async getAllBusinesses(): Promise<any> {
    const q = query(collection(db, "businesses"));

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return data;
  }

  static async getBusinessByOwner(ownerId: string): Promise<any> {
    const q = query(
      collection(db, "businesses"),
      where("owner", "==", ownerId),
    );

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return data;
  }

  // static async addBusinessWorker(workerId: string, businessName: string): Promise<any> {
  //   const businessRef = doc(db, "businesses", businessName);
  //   await updateDoc(businessRef, {
  //     workers: arrayUnion(workerId)
  //   })
  // }

  static async addTransactionDocument(
    id: string,
    transactionData: Transaction,
  ): Promise<any> {
    const docRef = await setDoc(doc(db, "transactions", id), transactionData);
    return docRef;
  }

  static async addExpenseDocument(
    id: string,
    expenseData: Transaction,
  ): Promise<any> {
    const docRef = await setDoc(doc(db, "expenses", id), expenseData);
    return docRef;
  }

  static async getTransactions(business: string): Promise<any> {
    const q = query(
      collection(db, "transactions"),
      where("business", "==", business),
    );

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return data;
  }

  static async deleteTransaction(id: string): Promise<any> {
    await deleteDoc(doc(db, "transactions", id));
  }

  static async deleteExpense(id: string): Promise<any> {
    await deleteDoc(doc(db, "expenses", id));
  }
}
