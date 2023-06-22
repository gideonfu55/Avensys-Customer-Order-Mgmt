// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/compat/firestore" //importing firestore module differently
import 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXKG1fgInMO08UudRbGT4hokPb1zdR0oE",
  authDomain: "springtest-f7ba8.firebaseapp.com",
  projectId: "springtest-f7ba8",
  storageBucket: "springtest-f7ba8.appspot.com",
  messagingSenderId: "722945565372",
  appId: "1:722945565372:web:922a519a4de90e5f46e6b9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);