// Import the functions you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 👇 você copia isso do Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyBzxCjH-6oBalaK-_YPxzBIOdr448e5-0w",
  authDomain: "vitrine-app-63447.firebaseapp.com",
  projectId: "vitrine-app-63447",
  storageBucket: "vitrine-app-63447.appspot.com",
  messagingSenderId: "347822490299",
  appId: "1:347822490299:web:da0211b010273cfdb19f9e"
};

// Inicializa
const app = initializeApp(firebaseConfig);

// Banco
export const db = getFirestore(app);