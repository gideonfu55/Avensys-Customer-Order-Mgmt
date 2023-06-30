import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5WJM4hfPMLPF_nDQvcZwwiaJYAdH3a34",
  authDomain: "avensys-ojt.firebaseapp.com",
  databaseURL: "https://avensys-ojt-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "avensys-ojt",
  storageBucket: "avensys-ojt.appspot.com",
  messagingSenderId: "299850081895",
  appId: "1:299850081895:web:ca007cce5bee0c470f96c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const messaging = app.messaging();