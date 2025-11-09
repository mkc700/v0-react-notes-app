import React, { useState, useEffect } from 'react';
import {StyleSheet,Text,View,TouchableOpacity,FlatList,Modal,TextInput,Alert,KeyboardAvoidingView,Platform,TouchableWithoutFeedback,Keyboard,ScrollView,Dimensions} from 'react-native';
import { notesService } from '../../Service/notesService';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function NotesScreen({ navigation }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: '',
    isReminder: false,
    reminderDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupedNotes, setGroupedNotes] = useState({});

  // Cargar notas al iniciar
  useEffect(() => {
    if (user) {
      console.log('📝 Cargando notas para usuario:', user.uid);
      const unsubscribe = notesService.getUserNotes(user.uid, (notesList) => {
        console.log('✅ Notas cargadas:', notesList.length);
        setNotes(notesList);
        setFilteredNotes(notesList);
        groupNotesByMonth(notesList);
        setLoading(false);
      });
      return unsubscribe;
    }
  }, [user]);

  // Filtrar notas cuando cambia la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNotes(notes);
      groupNotesByMonth(notes);
    } else {
      const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (note.category && note.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredNotes(filtered);
      groupNotesByMonth(filtered);
    }
  }, [searchQuery, notes]);

  // Agrupar notas por mes
  const groupNotesByMonth = (notesList) => {
    const grouped = {};
    
    notesList.forEach(note => {
      const date = new Date(note.createdAt?.toDate?.() || note.createdAt);
      const monthYear = date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long' 
      }).toUpperCase();
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(note);
    });

    // Ordenar los meses (más reciente primero)
    const sortedGrouped = {};
    Object.keys(grouped)
      .sort((a, b) => new Date(b) - new Date(a))
      .forEach(key => {
        sortedGrouped[key] = grouped[key];
      });

    setGroupedNotes(sortedGrouped);
  };

  // Crear nueva nota
  const handleCreateNote = async () => {
    if (!newNote.title.trim()) {
      Alert.alert('Error', 'La nota necesita un título');
      return;
    }

    try {
      const noteData = {
        title: newNote.title,
        content: newNote.content,
        category: newNote.category,
        isReminder: newNote.isReminder,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (newNote.isReminder && newNote.reminderDate) {
        noteData.reminderDate = newNote.reminderDate;
        noteData.date = newNote.reminderDate;
      }

      const result = await notesService.createNote(user.uid, noteData);

      if (result.success) {
        setModalVisible(false);
        resetForm();
        Alert.alert('Éxito', 'Nota creada correctamente');
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.error('❌ Error creando nota:', error);
      Alert.alert('Error', 'No se pudo crear la nota');
    }
  };

  // Actualizar nota
  const handleUpdateNote = async () => {
    if (!newNote.title.trim()) {
      Alert.alert('Error', 'La nota necesita un título');
      return;
    }

    try {
      const noteData = {
        title: newNote.title,
        content: newNote.content,
        category: newNote.category,
        isReminder: newNote.isReminder,
        updatedAt: new Date()
      };

      if (newNote.isReminder && newNote.reminderDate) {
        noteData.reminderDate = newNote.reminderDate;
        noteData.date = newNote.reminderDate;
      }

      const result = await notesService.updateNote(selectedNote.id, noteData);

      if (result.success) {
        setModalVisible(false);
        resetForm();
        Alert.alert('Éxito', 'Nota actualizada correctamente');
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.error('❌ Error actualizando nota:', error);
      Alert.alert('Error', 'No se pudo actualizar la nota');
    }
  };

  // Eliminar nota
  const handleDeleteNote = (noteId) => {
    Alert.alert(
      'Eliminar Nota',
      '¿Estás seguro de que quieres eliminar esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await notesService.deleteNote(noteId);
              Alert.alert('Éxito', 'Nota eliminada correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la nota');
            }
          }
        }
      ]
    );
  };

  // Agregar recordatorio a nota existente
  const handleAddReminder = async (note) => {
    setSelectedNote(note);
    setNewNote({
      title: note.title || '',
      content: note.content || '',
      category: note.category || '',
      isReminder: true,
      reminderDate: note.reminderDate || ''
    });
    setReminderModalVisible(true);
  };

  // Guardar recordatorio
  const handleSaveReminder = async () => {
    if (!newNote.reminderDate) {
      Alert.alert('Error', 'Selecciona una fecha para el recordatorio');
      return;
    }

    try {
      const result = await notesService.updateNote(selectedNote.id, {
        ...selectedNote,
        isReminder: true,
        reminderDate: newNote.reminderDate,
        date: newNote.reminderDate,
        updatedAt: new Date()
      });

      if (result.success) {
        setReminderModalVisible(false);
        resetForm();
        Alert.alert('Éxito', 'Recordatorio agregado correctamente');
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el recordatorio');
    }
  };

  // Abrir modal para crear/editar
  const openModal = (note = null) => {
    setIsEditing(!!note);
    setSelectedNote(note);
    setNewNote({
      title: note?.title || '',
      content: note?.content || '',
      category: note?.category || '',
      isReminder: note?.isReminder || false,
      reminderDate: note?.reminderDate || ''
    });
    setModalVisible(true);
  };

  // Resetear formulario
  const resetForm = () => {
    setNewNote({
      title: '',
      content: '',
      category: '',
      isReminder: false,
      reminderDate: ''
    });
    setSelectedNote(null);
    setIsEditing(false);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString?.toDate?.() || dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatear fecha simple (solo día y mes)
  const formatSimpleDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString?.toDate?.() || dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short'
    });
  };

  // Obtener fecha actual en formato YYYY-MM-DD
  const getCurrentDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Renderizar cada nota
  const renderNoteItem = ({ item }) => (
    <View style={styles.noteCard}>
      <TouchableOpacity onPress={() => openModal(item)} style={styles.noteContent}>
        <View style={styles.noteHeader}>
          <Text style={styles.noteTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteNote(item.id)}
          >
            <Text style={styles.deleteText}>×</Text>
          </TouchableOpacity>
        </View>
        
        {item.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        )}
        
        <Text style={styles.noteContentText} numberOfLines={3}>
          {item.content}
        </Text>
        
        <View style={styles.noteFooter}>
          <Text style={styles.noteDate}>
            {formatSimpleDate(item.createdAt)}
          </Text>
          {item.isReminder && item.reminderDate && (
            <View style={styles.reminderBadge}>
              <Text style={styles.reminderText}>📅 {formatSimpleDate(item.reminderDate)}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      
      {!item.isReminder && (
        <TouchableOpacity
          style={styles.reminderButton}
          onPress={() => handleAddReminder(item)}
        >
          <Text style={styles.reminderButtonText}>+ Recordatorio</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Renderizar sección por mes
  const renderSection = ({ section }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <FlatList
        data={section.data}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  // Preparar datos para secciones
  const sectionData = Object.keys(groupedNotes).map(month => ({
    title: month,
    data: groupedNotes[month]
  }));

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.background}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.appName}>Mis Notas</Text>
          <Text style={styles.version}>
            {filteredNotes.length} {filteredNotes.length === 1 ? 'nota' : 'notas'}
          </Text>
        </View>

        {/* BARRA DE BÚSQUEDA */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Buscar en notas..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearSearchButton}
              onPress={() => setSearchQuery('')}
            >
              <Text style={styles.clearSearchText}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* BOTÓN FLOTANTE */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => openModal()}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        {/* LISTA DE NOTAS */}
        <View style={styles.body}>
          {loading ? (
            <View style={styles.centerContent}>
              <Text style={styles.loadingText}>Cargando notas...</Text>
            </View>
          ) : filteredNotes.length === 0 ? (
            <View style={styles.centerContent}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyTitle}>
                {searchQuery ? 'No se encontraron notas' : 'No hay notas'}
              </Text>
              <Text style={styles.emptyText}>
                {searchQuery 
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Presiona el botón + para crear tu primera nota'
                }
              </Text>
              {searchQuery && (
                <TouchableOpacity 
                  style={styles.clearSearchBigButton}
                  onPress={() => setSearchQuery('')}
                >
                  <Text style={styles.clearSearchBigText}>Limpiar búsqueda</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={styles.calendarButton}
                onPress={() => navigation.navigate('Calendar')}
              >
                <Text style={styles.calendarButtonText}>📅 Ir al Calendario</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={sectionData}
              renderItem={renderSection}
              keyExtractor={(item) => item.title}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.notesList}
            />
          )}
        </View>

        {/* MODAL NOTA - MÁS GRANDE */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.modalOverlay}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
              >
                <TouchableWithoutFeedback>
                  <View style={styles.modalContent}>
                    {/* HEADER DEL MODAL CON BOTÓN CERRAR */}
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>
                        {isEditing ? 'Editar Nota' : 'Nueva Nota'}
                      </Text>
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                          setModalVisible(false);
                          resetForm();
                        }}
                      >
                        <Text style={styles.closeButtonText}>×</Text>
                      </TouchableOpacity>
                    </View>

                    {/* FORMULARIO CON SCROLL */}
                    <ScrollView 
                      style={styles.modalForm}
                      showsVerticalScrollIndicator={false}
                      keyboardShouldPersistTaps="handled"
                    >
                      <Text style={styles.inputLabel}>Título de la nota *</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Escribe el título aquí..."
                        placeholderTextColor="#999"
                        value={newNote.title}
                        onChangeText={(text) => setNewNote({...newNote, title: text})}
                        returnKeyType="next"
                        autoFocus={true}
                      />
                      
                      <Text style={styles.inputLabel}>Categoría (opcional)</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Ej: Trabajo, Personal, Ideas..."
                        placeholderTextColor="#999"
                        value={newNote.category}
                        onChangeText={(text) => setNewNote({...newNote, category: text})}
                        returnKeyType="next"
                      />
                      
                      <Text style={styles.inputLabel}>Contenido de la nota</Text>
                      <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Escribe el contenido de tu nota aquí..."
                        placeholderTextColor="#999"
                        value={newNote.content}
                        onChangeText={(text) => setNewNote({...newNote, content: text})}
                        multiline
                        numberOfLines={8}
                        textAlignVertical="top"
                        blurOnSubmit={true}
                      />

                      <TouchableOpacity
                        style={[
                          styles.reminderToggle,
                          newNote.isReminder && styles.reminderToggleActive
                        ]}
                        onPress={() => setNewNote({...newNote, isReminder: !newNote.isReminder})}
                      >
                        <Text style={[
                          styles.reminderToggleText,
                          newNote.isReminder && styles.reminderToggleTextActive
                        ]}>
                          {newNote.isReminder ? '📅 Con recordatorio' : '⏰ Agregar recordatorio'}
                        </Text>
                      </TouchableOpacity>

                      {newNote.isReminder && (
                        <View style={styles.reminderSection}>
                          <Text style={styles.reminderLabel}>Fecha del recordatorio:</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor="#999"
                            value={newNote.reminderDate}
                            onChangeText={(text) => setNewNote({...newNote, reminderDate: text})}
                            keyboardType="numbers-and-punctuation"
                            returnKeyType="done"
                          />
                          <Text style={styles.reminderHint}>
                            Formato: AAAA-MM-DD (ej: {getCurrentDate()})
                          </Text>
                        </View>
                      )}
                    </ScrollView>

                    {/* BOTONES FIJOS EN LA PARTE INFERIOR */}
                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={[styles.modalButton, styles.cancelButton]}
                        onPress={() => {
                          setModalVisible(false);
                          resetForm();
                        }}
                      >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.modalButton, styles.saveButton]}
                        onPress={isEditing ? handleUpdateNote : handleCreateNote}
                      >
                        <Text style={styles.saveButtonText}>
                          {isEditing ? 'Actualizar' : 'Guardar Nota'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* MODAL RECORDATORIO - MÁS GRANDE */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={reminderModalVisible}
          onRequestClose={() => setReminderModalVisible(false)}
        >
          <View style={styles.reminderModalOverlay}>
            <View style={styles.reminderModalContent}>
              <View style={styles.reminderModalHeader}>
                <Text style={styles.reminderModalTitle}>Agregar Recordatorio</Text>
                <TouchableOpacity
                  style={styles.reminderModalCloseButton}
                  onPress={() => {
                    setReminderModalVisible(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.reminderModalCloseText}>×</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.reminderModalSubtitle}>Para: {selectedNote?.title}</Text>
              
              <Text style={styles.reminderLabel}>Fecha del recordatorio:</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
                value={newNote.reminderDate}
                onChangeText={(text) => setNewNote({...newNote, reminderDate: text})}
              />
              <Text style={styles.reminderHint}>
                Formato: AAAA-MM-DD (ej: {getCurrentDate()})
              </Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setReminderModalVisible(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSaveReminder}
                >
                  <Text style={styles.saveButtonText}>Guardar Recordatorio</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: { 
    flex: 1, 
    backgroundColor: '#ffffff' 
  },
  header: {
    height: height * 0.18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  version: {
    fontSize: 16,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  // BARRA DE BÚSQUEDA
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f7fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2d3748',
  },
  clearSearchButton: {
    position: 'absolute',
    right: 30,
    padding: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearSearchText: {
    fontSize: 18,
    color: '#718096',
    fontWeight: 'bold',
  },
  clearSearchBigButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  clearSearchBigText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  body: {
    flex: 1,
    padding: 15,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#718096',
    fontSize: 16,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    color: '#667eea',
  },
  emptyTitle: {
    color: '#2d3748',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    color: '#718096',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  calendarButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
  calendarButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  // SECCIONES POR MES
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 15,
    paddingLeft: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
    paddingLeft: 15,
  },
  notesList: {
    paddingBottom: 20,
  },
  noteCard: {
    backgroundColor: '#f7fafc',
    borderRadius: 16,
    marginBottom: 12,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  noteContent: {
    flex: 1,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    flex: 1,
    marginRight: 10,
    lineHeight: 24,
  },
  deleteButton: {
    padding: 5,
    backgroundColor: '#fed7d7',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 18,
    color: '#e53e3e',
    fontWeight: 'bold',
  },
  categoryBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  noteContentText: {
    fontSize: 15,
    color: '#718096',
    lineHeight: 22,
    marginBottom: 12,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteDate: {
    fontSize: 13,
    color: '#a0aec0',
    fontStyle: 'italic',
  },
  reminderBadge: {
    backgroundColor: '#fed7d7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  reminderText: {
    color: '#c53030',
    fontSize: 12,
    fontWeight: '600',
  },
  reminderButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#667eea',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  reminderButtonText: {
    color: '#667eea',
    fontSize: 13,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 65,
    height: 65,
    backgroundColor: '#667eea',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  fabText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  // MODALES MÁS GRANDES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  keyboardAvoidingView: {
    width: '100%',
    height: '90%',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    width: '100%',
    height: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    flex: 1,
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#f7fafc',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#718096',
    fontWeight: 'bold',
  },
  modalForm: {
    flex: 1,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#f7fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 18,
    marginBottom: 20,
    color: '#2d3748',
    minHeight: 60,
  },
  textArea: {
    minHeight: 200,
    textAlignVertical: 'top',
    paddingTop: 18,
    lineHeight: 24,
  },
  reminderToggle: {
    backgroundColor: '#f7fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 60,
    justifyContent: 'center',
  },
  reminderToggleActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  reminderToggleText: {
    color: '#718096',
    fontSize: 18,
    fontWeight: '600',
  },
  reminderToggleTextActive: {
    color: 'white',
  },
  reminderSection: {
    marginTop: 10,
  },
  reminderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 8,
  },
  reminderHint: {
    fontSize: 14,
    color: '#718096',
    fontStyle: 'italic',
    marginTop: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 8,
    minHeight: 60,
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#e2e8f0',
  },
  cancelButtonText: {
    color: '#4a5568',
    fontWeight: '600',
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: '#667eea',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  // MODAL RECORDATORIO
  reminderModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  reminderModalContent: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 25,
    width: '90%',
    maxWidth: 400,
  },
  reminderModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  reminderModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d3748',
    flex: 1,
  },
  reminderModalCloseButton: {
    padding: 8,
    backgroundColor: '#f7fafc',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderModalCloseText: {
    fontSize: 24,
    color: '#718096',
    fontWeight: 'bold',
  },
  reminderModalSubtitle: {
    fontSize: 16,
    color: '#667eea',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
    padding: 12,
    backgroundColor: '#f0f4ff',
    borderRadius: 12,
  },
});