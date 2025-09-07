import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase.js";

// 禮服相關操作
export const dressService = {
  // 獲取所有禮服
  async getAll() {
    const q = query(collection(db, "dresses"), orderBy("創建時間", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  // 根據 ID 獲取單個禮服
  async getById(id) {
    const docRef = doc(db, "dresses", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    throw new Error("禮服不存在");
  },

  // 新增禮服
  async create(dressData) {
    const docRef = await addDoc(collection(db, "dresses"), {
      ...dressData,
      創建時間: serverTimestamp(),
      更新時間: serverTimestamp(),
    });
    return docRef.id;
  },

  // 更新禮服
  async update(id, dressData) {
    const docRef = doc(db, "dresses", id);
    await updateDoc(docRef, {
      ...dressData,
      更新時間: serverTimestamp(),
    });
  },

  // 刪除禮服
  async delete(id) {
    const docRef = doc(db, "dresses", id);
    await deleteDoc(docRef);
  },
};

// 合約相關操作
export const contractService = {
  // 獲取所有合約
  async getAll() {
    const q = query(
      collection(db, "contracts"),
      orderBy("合約建立日期時間", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  // 根據 ID 獲取單個合約
  async getById(id) {
    const docRef = doc(db, "contracts", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    throw new Error("合約不存在");
  },

  // 新增合約
  async create(contractData) {
    // 產生合約單號
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0].replace(/-/g, "");

    // 查詢今天的合約數量
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const q = query(
      collection(db, "contracts"),
      where("合約建立日期時間", ">=", startOfDay),
      where("合約建立日期時間", "<", endOfDay)
    );
    const snapshot = await getDocs(q);
    const todayCount = snapshot.size + 1;

    const contractNumber = `${dateStr}-${todayCount
      .toString()
      .padStart(3, "0")}`;

    const docRef = await addDoc(collection(db, "contracts"), {
      ...contractData,
      合約單號: contractNumber,
      合約建立日期時間: serverTimestamp(),
      創建時間: serverTimestamp(),
      更新時間: serverTimestamp(),
    });
    return docRef.id;
  },

  // 更新合約
  async update(id, contractData) {
    const docRef = doc(db, "contracts", id);
    await updateDoc(docRef, {
      ...contractData,
      更新時間: serverTimestamp(),
    });
  },

  // 刪除合約
  async delete(id) {
    const docRef = doc(db, "contracts", id);
    await deleteDoc(docRef);
  },
};
