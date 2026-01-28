import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWCkyupWZ9Vp_666-IQyMWU-wt7F2FdZA",
  authDomain: "sistema-cobranca-6b4f9.firebaseapp.com",
  projectId: "sistema-cobranca-6b4f9",
  storageBucket: "sistema-cobranca-6b4f9.firebasestorage.app",
  messagingSenderId: "816843763401",
  appId: "1:816843763401:web:056afb18b0bf5c32d0e718",
  measurementId: "G-QLH3RB896J",
};

// 1. Inicializa o App
const app = initializeApp(firebaseConfig);

// 2. Inicializa o Firestore com cache persistente (Modo Offline Moderno)
// O localCache já substitui o enableIndexedDbPersistence com mais eficiência
const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});

// 3. Exporta o db já configurado
export { db };
