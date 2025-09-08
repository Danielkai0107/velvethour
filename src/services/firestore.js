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
    try {
      const q = query(collection(db, "dresses"), orderBy("創建時間", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.warn("Firebase 未配置或連接失敗，返回示例資料:", error);
      // 返回示例禮服資料
      return [
        {
          id: "demo-dress-1",
          編號: "WD001",
          顏色: "白色",
          裙型: "魚尾",
          袖型: "無袖",
          領型: "v領",
          租借金額: 8000,
          加價金額: 1000,
          庫存數量: 1,
          備註: "經典優雅的白色婚紗，適合各種婚禮場合。包含頭紗和手套。",
          圖片: [
            "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400",
            "https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=400",
          ],
          新增時間戳: new Date("2024-01-15T10:30:00"),
          創建時間: new Date("2024-01-15T10:30:00"),
        },
        {
          id: "demo-dress-2",
          編號: "BD002",
          顏色: "黑色",
          裙型: "Aline",
          袖型: "短袖",
          領型: "圓領",
          租借金額: 6000,
          加價金額: 500,
          庫存數量: 2,
          備註: "時尚優雅的黑色晚禮服，完美展現女性魅力。適合晚宴和正式場合。",
          圖片: [
            "https://images.unsplash.com/photo-1566479179817-c08cbf4d8b90?w=400",
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
          ],
          新增時間戳: new Date("2024-01-10T14:20:00"),
          創建時間: new Date("2024-01-10T14:20:00"),
        },
        {
          id: "demo-dress-3",
          編號: "PD003",
          顏色: "粉色",
          裙型: "蓬裙",
          袖型: "長袖",
          領型: "桃心領",
          租借金額: 5000,
          加價金額: 0,
          庫存數量: 1,
          備註: "夢幻般的粉色公主裙，讓您成為最美的公主。適合拍照和特殊場合。",
          圖片: [
            "https://images.unsplash.com/photo-1515371180-a9d5c0b3d8c5?w=400",
          ],
          新增時間戳: new Date("2024-01-05T16:45:00"),
          創建時間: new Date("2024-01-05T16:45:00"),
        },
      ];
    }
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

  // 獲取禮服的租用檔期
  async getRentalSchedule(dressId) {
    try {
      // 查詢包含此禮服的所有合約
      const q = query(
        collection(db, "contracts"),
        orderBy("租用開始時間", "asc")
      );
      const snapshot = await getDocs(q);

      const rentalSchedule = [];
      snapshot.docs.forEach((doc) => {
        const contract = { id: doc.id, ...doc.data() };

        // 檢查合約中是否包含此禮服
        if (
          contract.禮服清單 &&
          contract.禮服清單.some((item) => item.禮服ID === dressId)
        ) {
          rentalSchedule.push({
            合約單號: contract.合約單號,
            客戶姓名: contract.客戶姓名,
            租用開始時間: contract.租用開始時間,
            租用結束時間: contract.租用結束時間,
            處理狀態: contract.處理狀態,
            合約ID: contract.id,
          });
        }
      });

      return rentalSchedule;
    } catch (error) {
      console.warn("Firebase 未配置或連接失敗，返回示例資料:", error);

      // 返回示例租用檔期資料
      if (dressId === "demo-dress-1") {
        return [
          {
            合約單號: "20241201-001",
            客戶姓名: "張小姐",
            租用開始時間: new Date("2024-12-15T14:00:00"),
            租用結束時間: new Date("2024-12-16T18:00:00"),
            處理狀態: "進行中",
            合約ID: "demo-contract-1",
          },
        ];
      } else if (dressId === "demo-dress-2") {
        return [
          {
            合約單號: "20241201-001",
            客戶姓名: "張小姐",
            租用開始時間: new Date("2024-12-15T14:00:00"),
            租用結束時間: new Date("2024-12-16T18:00:00"),
            處理狀態: "進行中",
            合約ID: "demo-contract-1",
          },
          {
            合約單號: "20241201-002",
            客戶姓名: "李太太",
            租用開始時間: new Date("2024-12-20T16:00:00"),
            租用結束時間: new Date("2024-12-21T20:00:00"),
            處理狀態: "已確認",
            合約ID: "demo-contract-2",
          },
        ];
      } else if (dressId === "demo-dress-3") {
        return [
          {
            合約單號: "20241130-003",
            客戶姓名: "王小姐",
            租用開始時間: new Date("2024-11-30T12:00:00"),
            租用結束時間: new Date("2024-11-30T22:00:00"),
            處理狀態: "已完成",
            合約ID: "demo-contract-3",
          },
        ];
      }

      return [];
    }
  },

  // 檢查禮服在指定時間是否可用
  async checkDressAvailability(
    dressId,
    startTime,
    endTime,
    excludeContractId = null
  ) {
    try {
      console.log(
        `檢查禮服 ${dressId} 在時間 ${startTime} - ${endTime} 的可用性`
      );

      const rentalSchedule = await this.getRentalSchedule(dressId);
      console.log(`禮服 ${dressId} 的租用檔期:`, rentalSchedule);

      // 過濾掉當前正在編輯的合約（如果有的話）
      const filteredSchedule = excludeContractId
        ? rentalSchedule.filter((item) => item.合約ID !== excludeContractId)
        : rentalSchedule;

      console.log(
        `過濾後的檔期 (排除合約 ${excludeContractId}):`,
        filteredSchedule
      );

      // 檢查日期衝突 (只看日期，不看時間)
      const contractStartDate = new Date(startTime);
      const contractEndDate = new Date(endTime);

      // 計算實際檔期：合約開始時間到開始時間+7天
      const actualStartDate = new Date(
        contractStartDate.getFullYear(),
        contractStartDate.getMonth(),
        contractStartDate.getDate()
      );
      const actualEndDate = new Date(actualStartDate);
      actualEndDate.setDate(actualStartDate.getDate() + 7);

      console.log("檔期計算:", {
        合約開始時間: contractStartDate,
        合約結束時間: contractEndDate,
        實際檔期開始: actualStartDate,
        實際檔期結束: actualEndDate,
        說明: "實際檔期 = 合約開始時間 + 7天",
      });

      for (const schedule of filteredSchedule) {
        const scheduleStart =
          schedule.租用開始時間 instanceof Date
            ? schedule.租用開始時間
            : schedule.租用開始時間.toDate
            ? schedule.租用開始時間.toDate()
            : new Date(schedule.租用開始時間);
        const scheduleEnd =
          schedule.租用結束時間 instanceof Date
            ? schedule.租用結束時間
            : schedule.租用結束時間.toDate
            ? schedule.租用結束時間.toDate()
            : new Date(schedule.租用結束時間);

        // 計算現有合約的實際檔期（也是開始時間+7天）
        const scheduleActualStartDate = new Date(
          scheduleStart.getFullYear(),
          scheduleStart.getMonth(),
          scheduleStart.getDate()
        );
        const scheduleActualEndDate = new Date(scheduleActualStartDate);
        scheduleActualEndDate.setDate(scheduleActualStartDate.getDate() + 7);

        console.log(`檢查與合約 ${schedule.合約單號} 的檔期重疊:`, {
          現有合約開始: scheduleStart,
          現有合約實際檔期開始: scheduleActualStartDate,
          現有合約實際檔期結束: scheduleActualEndDate,
          新合約實際檔期開始: actualStartDate,
          新合約實際檔期結束: actualEndDate,
          isOverlap: !(
            actualEndDate < scheduleActualStartDate ||
            actualStartDate > scheduleActualEndDate
          ),
          處理狀態: schedule.處理狀態,
          說明: "比較實際檔期（都是開始時間+7天）",
        });

        // 檢查實際檔期重疊
        if (
          !(
            actualEndDate < scheduleActualStartDate ||
            actualStartDate > scheduleActualEndDate
          )
        ) {
          // 只有進行中、已確認、待確認的合約才算衝突
          if (
            schedule.處理狀態 === "進行中" ||
            schedule.處理狀態 === "已確認" ||
            schedule.處理狀態 === "待確認"
          ) {
            console.log(
              `發現衝突！合約 ${schedule.合約單號} 狀態: ${schedule.處理狀態}`
            );
            return {
              available: false,
              conflictContract: schedule,
            };
          }
        }
      }

      console.log(`禮服 ${dressId} 在指定時間可用`);
      return { available: true };
    } catch (error) {
      console.error("檢查禮服可用性失敗:", error);
      return { available: true }; // 發生錯誤時預設為可用
    }
  },
};

// 合約相關操作
export const contractService = {
  // 獲取所有合約
  async getAll() {
    try {
      const q = query(
        collection(db, "contracts"),
        orderBy("合約建立日期時間", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.warn("Firebase 未配置或連接失敗，返回示例資料:", error);
      // 返回示例合約資料
      return [
        {
          id: "demo-contract-1",
          合約單號: "20241201-001",
          合約建立日期時間: new Date("2024-12-01T10:30:00"),
          租用開始時間: new Date("2024-12-15T14:00:00"),
          租用結束時間: new Date("2024-12-16T18:00:00"),
          處理狀態: "進行中",
          客戶姓名: "張小姐",
          電話: "0912-345-678",
          email: "zhang@example.com",
          三圍: "32B-24-35",
          承辦人: "林小姐",
          禮服清單: [
            {
              禮服ID: "demo-dress-1",
              數量: 1,
              單價: 8000,
              小計: 8000,
            },
            {
              禮服ID: "demo-dress-2",
              數量: 1,
              單價: 1000,
              小計: 1000,
            },
          ],
          合約總金額: 9000,
          備注: "客戶要求特殊修改，需要調整腰身尺寸。",
          創建時間: new Date("2024-12-01T10:30:00"),
          更新時間: new Date("2024-12-01T10:30:00"),
        },
        {
          id: "demo-contract-2",
          合約單號: "20241201-002",
          合約建立日期時間: new Date("2024-12-01T14:20:00"),
          租用開始時間: new Date("2024-12-20T16:00:00"),
          租用結束時間: new Date("2024-12-21T20:00:00"),
          處理狀態: "已確認",
          客戶姓名: "李太太",
          電話: "0923-456-789",
          email: "li@example.com",
          三圍: "34C-26-36",
          承辦人: "王先生",
          禮服清單: [
            {
              禮服ID: "demo-dress-2",
              數量: 1,
              單價: 6000,
              小計: 6000,
            },
          ],
          合約總金額: 6000,
          備注: "客戶需要配件搭配，已確認頭紗和手套。",
          創建時間: new Date("2024-12-01T14:20:00"),
          更新時間: new Date("2024-12-01T14:20:00"),
        },
        {
          id: "demo-contract-3",
          合約單號: "20241130-003",
          合約建立日期時間: new Date("2024-11-30T09:15:00"),
          租用開始時間: new Date("2024-11-30T12:00:00"),
          租用結束時間: new Date("2024-11-30T22:00:00"),
          處理狀態: "已完成",
          客戶姓名: "王小姐",
          電話: "0934-567-890",
          email: "wang@example.com",
          三圍: "30A-23-34",
          承辦人: "陳小姐",
          禮服清單: [
            {
              禮服ID: "demo-dress-3",
              數量: 1,
              單價: 5000,
              小計: 5000,
            },
          ],
          合約總金額: 5000,
          備注: "婚禮拍攝用途，已順利完成。客戶非常滿意。",
          創建時間: new Date("2024-11-30T09:15:00"),
          更新時間: new Date("2024-11-30T23:30:00"),
        },
      ];
    }
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
    try {
      // 如果已經有合約單號，直接使用；否則生成一個
      let contractNumber = contractData.合約單號;

      if (!contractNumber) {
        // 備用的合約單號生成邏輯（如果前端沒有生成）
        const today = new Date();
        const year = today.getFullYear().toString().slice(-2);
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const day = today.getDate().toString().padStart(2, "0");
        const dateStr = `${month}${day}`;

        // 查詢今天的合約數量
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const allContracts = await this.getAll();
        const todayContracts = allContracts.filter((contract) => {
          if (!contract.創建時間) return false;

          let contractDate;
          if (
            contract.創建時間.toDate &&
            typeof contract.創建時間.toDate === "function"
          ) {
            contractDate = contract.創建時間.toDate();
          } else if (contract.創建時間 instanceof Date) {
            contractDate = contract.創建時間;
          } else {
            contractDate = new Date(contract.創建時間);
          }

          return contractDate >= startOfDay && contractDate <= endOfDay;
        });

        const serialNumber = (todayContracts.length + 1)
          .toString()
          .padStart(3, "0");
        contractNumber = `V${year}${dateStr}${serialNumber}`;
      }

      console.log("保存合約，使用合約單號:", contractNumber);

      const docRef = await addDoc(collection(db, "contracts"), {
        ...contractData,
        合約單號: contractNumber,
        合約建立日期時間: contractData.合約建立日期時間 || serverTimestamp(),
        創建時間: contractData.創建時間 || serverTimestamp(),
        更新時間: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("新增合約失敗:", error);
      throw error;
    }
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

// 承辦人相關操作
export const staffService = {
  // 獲取所有承辦人
  async getAll() {
    try {
      const q = query(collection(db, "staff"), orderBy("創建時間", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.warn("Firebase 未配置或連接失敗，返回示例資料:", error);
      // 返回示例承辦人資料
      return [
        {
          id: "demo-staff-1",
          姓名: "林小姐",
          員工編號: "EMP001",
          職位: "禮服顧問",
          部門: "銷售部",
          狀態: "在職",
          電話: "0912-111-111",
          email: "lin@velvethour.com",
          加入日期: new Date("2024-01-15"),
          備註: "資深禮服顧問，擅長婚紗搭配和客戶服務。",
          創建時間: new Date("2024-01-15T09:00:00"),
          更新時間: new Date("2024-01-15T09:00:00"),
        },
        {
          id: "demo-staff-2",
          姓名: "王先生",
          員工編號: "EMP002",
          職位: "造型師",
          部門: "造型部",
          狀態: "在職",
          電話: "0923-222-222",
          email: "wang@velvethour.com",
          加入日期: new Date("2024-02-01"),
          備註: "專業造型師，負責新娘造型設計和妝髮服務。",
          創建時間: new Date("2024-02-01T10:30:00"),
          更新時間: new Date("2024-02-01T10:30:00"),
        },
        {
          id: "demo-staff-3",
          姓名: "陳小姐",
          員工編號: "EMP003",
          職位: "客服專員",
          部門: "客服部",
          狀態: "在職",
          電話: "0934-333-333",
          email: "chen@velvethour.com",
          加入日期: new Date("2024-03-01"),
          備註: "負責客戶諮詢和售後服務，服務態度親切。",
          創建時間: new Date("2024-03-01T14:20:00"),
          更新時間: new Date("2024-03-01T14:20:00"),
        },
      ];
    }
  },

  // 根據 ID 獲取單個承辦人
  async getById(id) {
    try {
      const docRef = doc(db, "staff", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      throw new Error("承辦人不存在");
    } catch (error) {
      // 如果是示例資料，從示例中查找
      const allStaff = await this.getAll();
      const staff = allStaff.find((s) => s.id === id);
      if (staff) {
        return staff;
      }
      throw new Error("承辦人不存在");
    }
  },

  // 新增承辦人
  async create(staffData) {
    const docRef = await addDoc(collection(db, "staff"), {
      ...staffData,
      創建時間: serverTimestamp(),
      更新時間: serverTimestamp(),
    });
    return docRef.id;
  },

  // 更新承辦人
  async update(id, staffData) {
    const docRef = doc(db, "staff", id);
    await updateDoc(docRef, {
      ...staffData,
      更新時間: serverTimestamp(),
    });
  },

  // 刪除承辦人
  async delete(id) {
    const docRef = doc(db, "staff", id);
    await deleteDoc(docRef);
  },
};
