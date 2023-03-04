// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEvYKqR17hjb5iZr1b_7MDtJdNbpsdQF4",
  authDomain: "quiz-app-39799.firebaseapp.com",
  projectId: "quiz-app-39799",
  storageBucket: "quiz-app-39799.appspot.com",
  messagingSenderId: "364031282655",
  appId: "1:364031282655:web:bc49c4520bb0fadb9ec86a"
};

// Initialize Firebase / firestore db
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);