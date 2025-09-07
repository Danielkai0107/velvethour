import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX",
};

// 檢查是否為示例配置
const isUsingDemoConfig = firebaseConfig.apiKey === "demo-api-key";

if (isUsingDemoConfig) {
  console.warn('🔥 Firebase 配置：使用示例配置，請設定真實的 Firebase 環境變數');
}

let app, db, storage, auth;

try {
  app = initializeApp(firebaseConfig);
  
  if (isUsingDemoConfig) {
    // 使用示例配置時，不初始化真實的 Firebase 服務
    console.warn('🔥 Firebase 服務：使用離線模式，所有資料為示例資料');
    db = null;
    storage = null;
    auth = null;
  } else {
    // 使用真實配置
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
    console.log('🔥 Firebase 已成功初始化');
  }
} catch (error) {
  console.error('🔥 Firebase 初始化失敗:', error);
  db = null;
  storage = null;
  auth = null;
}

export { db, storage, auth };
