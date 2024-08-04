// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoLGyadnHxTjoXtj36shfneTOsKk0geKk",
  authDomain: "hostelhq-a2bae.firebaseapp.com",
  projectId: "hostelhq-a2bae",
  storageBucket: "hostelhq-a2bae.appspot.com",
  messagingSenderId: "82972297941",
  appId: "1:82972297941:web:045fa797ddcb05536db05c", 
  measurementId: "G-SS1B29MW0T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth, db };