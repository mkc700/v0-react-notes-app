import { createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,onAuthStateChanged,updateProfile} from 'firebase/auth';
import { auth } from './firebase';

export const authService = {
  // Registrar nuevo usuario
  signUp: async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar perfil con nombre
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
      }
      
      return {
        success: true,
        user: userCredential.user
      };
    } catch (error) {
      let errorMessage = "Error al crear cuenta";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este correo ya está registrado";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "La contraseña es muy débil";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Correo electrónico inválido";
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Iniciar sesión
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: userCredential.user
      };
    } catch (error) {
      let errorMessage = "Error al iniciar sesión";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "Usuario no encontrado";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Contraseña incorrecta";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Correo electrónico inválido";
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Cerrar sesión
  signOut: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Error al cerrar sesión"
      };
    }
  },

  //cambios de autenticación
  onAuthStateChange: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    return auth.currentUser;
  }
};