import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAGMWdznqfxSeb1S2iqXCZToDW9kSLQdFc",
    authDomain: "sportstogo-5cb0b.firebaseapp.com",
    projectId: "sportstogo-5cb0b",
    storageBucket: "sportstogo-5cb0b.firebasestorage.app",
    messagingSenderId: "1097238147058",
    appId: "1:1097238147058:web:94726ad97ee05f15dd056b",
    measurementId: "G-Z44EEZ3PC5"
};
  
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
