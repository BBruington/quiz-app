// Import the functions you need from the SDKs you need
import { 
  getAuth, 
  signInWithPopup, 
  signInWithRedirect, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
 } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import uuid from "react-uuid"


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
export const auth = getAuth();

const googleProvider = new GoogleAuthProvider();


googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);

export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);


//sign up email
export const signUpWithEmail = async (email, password) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    setDoc(doc(db, "users", user.email), {
      email: user.email,
      id: uuid(),
      createdAt: {
        seconds: Date.now()/1000,
        milliseconds: Date.now()
      }
    })
    //console.log("user", user)
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
}
export const signInWithEmail = async (email, password) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });

}

export const signOutUser = async () => {
  return await signOut(auth)//.then(() => {
    // Sign-out successful.
  //})
  .catch((error) => {
    // An error happened.
  });
}

export const onAuthStateChangedListener = () => onAuthStateChanged(auth, callback);

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (userAuth) => {
        unsubscribe();
        resolve(userAuth);
      },
      reject
    );
  });
};