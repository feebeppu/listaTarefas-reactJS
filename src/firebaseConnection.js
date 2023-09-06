import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDZoPXGZKT2ZlBm_AbvA177dZLLQIhbMww",
    authDomain: "fireauthentication-b1e59.firebaseapp.com",
    projectId: "fireauthentication-b1e59",
    storageBucket: "fireauthentication-b1e59.appspot.com",
    messagingSenderId: "590731356767",
    appId: "1:590731356767:web:9c8c605e8e8691c166c9ea",
    measurementId: "G-53HZZG3VEL"
  };

  const firebaseApp = initializeApp(firebaseConfig)

  const db = getFirestore(firebaseApp)
  const auth = getAuth(firebaseApp)

  export { db, auth }