// Service/notesService.js
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot,orderBy } from 'firebase/firestore';
import { db } from './firebase';

const notesService = {
  
  createNote: async (userId, noteData) => {
    try {
      console.log('💾 Creando nota para usuario:', userId);
      const docRef = await addDoc(collection(db, 'notes'), {
        ...noteData,
        userId: userId,
        createdAt: noteData.createdAt || new Date(),
        updatedAt: noteData.updatedAt || new Date()
      });
      
      console.log('✅ Nota creada con ID:', docRef.id);
      return { 
        success: true, 
        noteId: docRef.id 
      };
      
    } catch (error) {
      console.error('❌ Error creando nota:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  
  getUserNotes: (userId, callback) => {
    try {
      console.log('🔍 Suscribiendo a notas de:', userId);
      
      const q = query(
        collection(db, 'notes'), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(
        q, 
        (querySnapshot) => {
          const notesList = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            notesList.push({
              id: doc.id,
              ...data,
              // Asegurar que las fechas sean manejables
              createdAt: data.createdAt,
              updatedAt: data.updatedAt
            });
          });
          console.log('📝 Notas recibidas:', notesList.length);
          callback(notesList);
        },
        (error) => {
          console.error('❌ Error en listener de notas:', error);
        }
      );

      return unsubscribe;
      
    } catch (error) {
      console.error('❌ Error configurando listener de notas:', error);
      return () => {}; // Retornar función vacía para evitar errores
    }
  },

  // Obtener solo recordatorios (para el calendario)
  getUserReminders: (userId, callback) => {
    try {
      console.log('🔍 Suscribiendo a recordatorios de:', userId);
      
      const q = query(
        collection(db, 'notes'), 
        where('userId', '==', userId),
        where('isReminder', '==', true),
        orderBy('date', 'desc')
      );

      const unsubscribe = onSnapshot(
        q, 
        (querySnapshot) => {
          const remindersList = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            remindersList.push({
              id: doc.id,
              ...data,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt
            });
          });
          console.log('📅 Recordatorios recibidos:', remindersList.length);
          callback(remindersList);
        },
        (error) => {
          console.error('❌ Error en listener de recordatorios:', error);
        }
      );

      return unsubscribe;
      
    } catch (error) {
      console.error('❌ Error configurando listener de recordatorios:', error);
      return () => {};
    }
  },

  // Actualizar nota
  updateNote: async (noteId, noteData) => {
    try {
      console.log('✏️ Actualizando nota:', noteId);
      await updateDoc(doc(db, 'notes', noteId), {
        ...noteData,
        updatedAt: new Date()
      });
      
      return { 
        success: true
      };
      
    } catch (error) {
      console.error('❌ Error actualizando nota:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  // Eliminar nota
  deleteNote: async (noteId) => {
    try {
      console.log('🗑️ Eliminando nota:', noteId);
      await deleteDoc(doc(db, 'notes', noteId));
      console.log('✅ Nota eliminada');
    } catch (error) {
      console.error('❌ Error eliminando nota:', error);
      throw error;
    }
  },

  // Alias para compatibilidad con recordatorios existentes
  createReminder: async (userId, reminderData) => {
    return notesService.createNote(userId, {
      ...reminderData,
      isReminder: true
    });
  }
};

export { notesService };