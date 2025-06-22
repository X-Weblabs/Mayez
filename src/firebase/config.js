import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyB9DpSemUQoyaV52FrZXXlzf37o8OH17Z0",
  authDomain: "mayez-tournament.firebaseapp.com",
  projectId: "mayez-tournament",
  storageBucket: "mayez-tournament.appspot.com",
  messagingSenderId: "412595191401",
  appId: "1:412595191401:web:0e6cc0b43833a8a9c2acf8"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
