// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyALW5iTD8Kh7bguHVF-uXZrCBFOeP-t6Gs",
    authDomain: "friga-notes.firebaseapp.com",
    projectId: "friga-notes",
    storageBucket: "friga-notes.firebasestorage.app",
    messagingSenderId: "272378518818",
    appId: "1:272378518818:web:af94f905149fd3cf48597b"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;