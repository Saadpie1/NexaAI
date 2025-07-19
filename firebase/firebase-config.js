import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getFirestore, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAmymP8ix1F1JQM6Rvom1i3TLxQuy8_Nv8",
  authDomain: "nexaai-24066.firebaseapp.com",
  projectId: "nexaai-24066",
  storageBucket: "nexaai-24066.appspot.com",
  messagingSenderId: "396496209661",
  appId: "1:396496209661:web:912128a45017e93a8b2094",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, serverTimestamp };
