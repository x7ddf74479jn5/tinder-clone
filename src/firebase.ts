// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1ID_DMdWHm9LXCcNzE5pp3XfQtKmENWo",
  authDomain: "tinder-clone-296b7.firebaseapp.com",
  projectId: "tinder-clone-296b7",
  storageBucket: "tinder-clone-296b7.appspot.com",
  messagingSenderId: "299539648140",
  appId: "1:299539648140:web:a523ef5ff51301d774f5a9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
