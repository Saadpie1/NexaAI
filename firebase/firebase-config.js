// firebase/firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyAmymP8ix1F1JQM6Rvom1i3TLxQuy8_Nv8",
  authDomain: "nexaai-24066.firebaseapp.com",
  projectId: "nexaai-24066",
  storageBucket: "nexaai-24066.appspot.com",
  messagingSenderId: "396496209661",
  appId: "1:396496209661:web:912128a45017e93a8b2094",
  measurementId: "G-2HHC4B02DS"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

