import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDU6oFaKtsQxCpkxp4yBHnMTzl9tfz7AiM",
  authDomain: "meal-planner-app-e3b6c.firebaseapp.com",
  projectId: "meal-planner-app-e3b6c",
  storageBucket: "meal-planner-app-e3b6c.firebasestorage.app",
  messagingSenderId: "123761561787",
  appId: "1:123761561787:web:8e6790fd43364e7761999e",
  measurementId: "G-G1WTVV26QN"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
