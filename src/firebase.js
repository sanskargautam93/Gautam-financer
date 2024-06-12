import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSzla1agL5bEuOGqxOTWdX4SsAO4Tb-Uw",
  authDomain: "personal-finance-f52b4.firebaseapp.com",
  projectId: "personal-finance-f52b4",
  storageBucket: "personal-finance-f52b4.appspot.com",
  messagingSenderId: "957323592440",
  appId: "1:957323592440:web:7b08d07b9346cbbaa1b10d",
  measurementId: "G-RPFE6JW1JZ"
};

const app = initializeApp(firebaseConfig);
const analytics= getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };