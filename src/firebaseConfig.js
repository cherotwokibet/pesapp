// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


//Quota Reached
// const firebaseConfig = {
//   apiKey: "AIzaSyBRLpiXOgM74nvbz8eqL9gPF8q7EO4pDjw",
//   authDomain: "pesapp-39bef.firebaseapp.com",
//   projectId: "pesapp-39bef",
//   storageBucket: "pesapp-39bef.appspot.com",
//   messagingSenderId: "780431578699",
//   appId: "1:780431578699:web:f8c8c3997321b841c0dfce"
// };

const firebaseConfig = {
  apiKey: "AIzaSyAQG_2xXVSjLm42Ag2mfNWnTFunw4a910Y",
  authDomain: "senddeposit.firebaseapp.com",
  databaseURL: "https://senddeposit-default-rtdb.firebaseio.com",
  projectId: "senddeposit",
  storageBucket: "senddeposit.appspot.com",
  messagingSenderId: "63026505055",
  appId: "1:63026505055:web:74b7d9a426c51c3cd042ea",
  measurementId: "G-9TXPZPKLP0"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



export { auth, db, app }

