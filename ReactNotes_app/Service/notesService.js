import { collection,addDoc,updateDoc,deleteDoc,doc,query,where,orderBy,onSnapshot,serverTimestamp} from 'firebase/firestore';
import { db } from '/firebase';

export const notesService = {
  // Crear nueva nota
  createNote: async (userId, noteData) => {
    try {
      const docRef = await addDoc(collection(db, "notes"), {
        ...noteData,
        userId: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isPinned: false,
        isArchived: false
      });
      return {
        success: true,
        noteId: docRef.id
      };
    } catch (error) {
      return {
        success: false,
        error: "Error al crear la nota"
      };
    }
  },

  // Obtener notas en tiempo real
  getUserNotes: (userId, callback) => {
    const q = query(
      collection(db, "notes"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    return onSnapshot(q, (snapshot) => {
      const notes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(notes);
    });
  },

  // Actualizar nota
  updateNote: async (noteId, updates) => {
    try {
      const noteRef = doc(db, "notes", noteId);
      await updateDoc(noteRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Error al actualizar la nota"
      };
    }
  },

  // Eliminar nota
  deleteNote: async (noteId) => {
    try {
      await deleteDoc(doc(db, "notes", noteId));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Error al eliminar la nota"
      };
    }
  },

  // Cambiar estado de anclaje
  togglePinNote: async (noteId, isPinned) => {
    try {
      const noteRef = doc(db, "notes", noteId);
      await updateDoc(noteRef, {
        isPinned: !isPinned,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Error al anclar/desanclar la nota"
      };
    }
  }
};