import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCE9povG2cVTAD3OhC2nAlqjW78yL-oABM",
  authDomain: "iddi-5da84.firebaseapp.com",
  databaseURL: "https://iddi-5da84-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "iddi-5da84",
  storageBucket: "iddi-5da84.firebasestorage.app",
  messagingSenderId: "828716417217",
  appId: "1:828716417217:web:dc6d4aa9c1e9a6c8e05440"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
