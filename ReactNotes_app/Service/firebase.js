// firebase.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';



const firebaseConfig = {
    apiKey: "AIzaSyALW5iTD8Kh7bguHVF-uXZrCBFOeP-t6Gs",
    authDomain: "friga-notes.firebaseapp.com",
    projectId: "friga-notes",
    storageBucket: "friga-notes.firebasestorage.app",
    messagingSenderId: "272378518818",
    appId: "1:272378518818:web:af94f905149fd3cf48597b"
  };
 
// INICIALIZAR APP
let app;
let auth;
let db;

try {
  console.log('🔥 Inicializando Firebase...');
  
  // Inicializar la app de Firebase
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase App inicializada');
  
  
  if (Platform.OS !== 'web') {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
    console.log('✅ Firebase Auth inicializado con persistencia React Native');
  } else {
    
    const { getAuth } = require('firebase/auth');
    auth = getAuth(app);
    console.log('✅ Firebase Auth inicializado para web');
  }

  
  db = getFirestore(app);
  console.log('✅ Firestore inicializado');
  
  
  if (Platform.OS !== 'web') {
    enableIndexedDbPersistence(db)
      .then(() => console.log('✅ Persistencia Firestore habilitada'))
      .catch((err) => {
        console.warn('⚠️ Persistencia Firestore no disponible:', err.code);
      });
  }
  
} catch (error) {
  console.error('❌ Error inicializando Firebase:', error);
}

export { auth, db };
export default app;