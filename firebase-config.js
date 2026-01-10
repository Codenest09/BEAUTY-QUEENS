// Firebase Configuration and Initialization
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: Replace the following with your app's Firebase project configuration
// These values can be found in the Firebase Console: Project Settings > General > Your Apps
const firebaseConfig = {
    apiKey: "AIzaSyDSdrVxMaWXNHHnkeV7yyPiQcFGesHEL1I",
    authDomain: "beauty-queens-bd6cf.firebaseapp.com",
    projectId: "beauty-queens-bd6cf",
    storageBucket: "beauty-queens-bd6cf.firebasestorage.app",
    messagingSenderId: "785739580312",
    appId: "1:785739580312:web:73fefcada2e2fd824761ed",
    measurementId: "G-MR4J2RTTJ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
