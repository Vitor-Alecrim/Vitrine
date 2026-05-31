// Import the functions you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

// 👇 você copia isso do Firebase console
const firebaseConfig = {
  apiKey: "SUA_API_KEY", // Firebase API Key
  authDomain: "SEU_AUTH_DOMAIN", // Auth Domain
  projectId: "SEU_PROJECT_ID", // Project ID
  storageBucket: "SEU_STORAGE_BUCKET", // Storage Bucket
  messagingSenderId: "SEU_SENDER_ID", // Messaging Sender ID
  appId: "SEU_APP_ID" // Firebase App ID
};

// Inicializa
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// Banco
const db = getFirestore(app);


export { auth, db };

