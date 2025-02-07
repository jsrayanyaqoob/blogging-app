import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD6JURSSAbYydtN-l8z0TAV2o4XATDIGRM",
  authDomain: "blogging-app-14c01.firebaseapp.com",
  projectId: "blogging-app-14c01",
  storageBucket: "blogging-app-14c01.firebasestorage.app",
  messagingSenderId: "1028415463178",
  appId: "1:1028415463178:web:1f461541412b2bfd1da4f3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);