import React, { useState, useEffect } from 'react';
import { StyleSheet,Text,View,TouchableOpacity, FlatList,Modal,TextInput,Alert,KeyboardAvoidingView,Platform,TouchableWithoutFeedback,Keyboard,ScrollView,Dimensions} from 'react-native';
import { notesService } from '../../Service/notesService';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function CalendarScreen({ navigation }) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [newNote, setNewNote] = useState({ 
    title: '', 
    content: '', 
    date: '',
    isReminder: true 
  });
  const [notes, setNotes] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDateNotes, setSelectedDateNotes] = useState([]);

  
  useEffect(() => {
    if (user) {
      console.log('🔍 Cargando recordatorios para usuario:', user.uid);
      const unsubscribe = notesService.getUserReminders(user.uid, (notesList) => {
        console.log('📝 Recordatorios cargados:', notesList.length);
        const notesByDate = {};
        notesList.forEach(note => {
          if (note.date) {
            if (!notesByDate[note.date]) {
              notesByDate[note.date] = [];
            }
            notesByDate[note.date].push(note);
          }
        });
        setNotes(notesByDate);
      });
      return unsubscribe;
    }
  }, [user]);

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  
  const changeMonth = (direction) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

 
  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();
    
    const calendar = [];

    
    for (let i = 0; i < startDay; i++) {
      calendar.push({ day: '', isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasNotes = notes[dateStr] && notes[dateStr].length > 0;
      const isSelected = dateStr === selectedDate;
      const isToday = dateStr === getCurrentDate();
      
      calendar.push({
        day,
        date: dateStr,
        isCurrentMonth: true,
        hasNotes,
        isSelected,
        isToday
      });
    }

    return calendar;
  };

  const getCurrentDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setNewNote(prev => ({ ...prev, date: date }));
    
    
    const dateNotes = notes[date] || [];
    setSelectedDateNotes(dateNotes);
    
    
    if (dateNotes.length > 0) {
      setViewModalVisible(true);
    } else {
      
      setCreateModalVisible(true);
    }
  };

  
  const handleCreateNote = async () => {
    if (isSaving) return;
    
    if (!newNote.title.trim()) {
      Alert.alert('Error', 'El recordatorio necesita un título');
      return;
    }

    console.log('💾 Guardando recordatorio...');
    setIsSaving(true);

    try {
      const result = await notesService.createReminder(user.uid, {
        title: newNote.title,
        content: newNote.content,
        date: selectedDate,
        isCompleted: false,
        isReminder: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      if (result.success) {
        console.log('✅ Recordatorio guardado');
        setCreateModalVisible(false);
        setNewNote({ title: '', content: '', date: '', isReminder: true });
        Alert.alert('Éxito', 'Recordatorio guardado correctamente');
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      Alert.alert('Error', 'No se pudo guardar el recordatorio');
    } finally {
      setIsSaving(false);
    }
  };

  
  const deleteNote = async (noteId) => {
    Alert.alert(
      'Eliminar recordatorio',
      '¿Estás seguro de que quieres eliminar este recordatorio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await notesService.deleteNote(noteId);
              
              const updatedNotes = selectedDateNotes.filter(note => note.id !== noteId);
              setSelectedDateNotes(updatedNotes);
              
              if (updatedNotes.length === 0) {
                setViewModalVisible(false);
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el recordatorio');
            }
          }
        }
      ]
    );
  };

  
  const formatDisplayDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const calendar = generateCalendar();

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.background}>
        
        <View style={styles.header}>
          <Text style={styles.appName}>Calendario</Text>
          <Text style={styles.version}>
            {monthNames[currentMonth]} {currentYear}
          </Text>
        </View>

        
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => changeMonth(-1)}
          >
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.monthText}>
            {monthNames[currentMonth]} {currentYear}
          </Text>

          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => changeMonth(1)}
          >
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        </View>

       
        <View style={styles.calendarContainer}>
          <View style={styles.weekDays}>
            {weekDays.map(day => (
              <Text key={day} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {calendar.map((dayInfo, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  dayInfo.isSelected && styles.selectedDay,
                  dayInfo.hasNotes && styles.hasNotesDay,
                  dayInfo.isToday && styles.todayDay
                ]}
                onPress={() => dayInfo.date && handleDateSelect(dayInfo.date)}
                disabled={!dayInfo.isCurrentMonth}
              >
                <Text style={[
                  styles.dayText,
                  !dayInfo.isCurrentMonth && styles.otherMonthText,
                  dayInfo.isSelected && styles.selectedDayText,
                  dayInfo.isToday && styles.todayText
                ]}>
                  {dayInfo.day}
                </Text>
                {dayInfo.hasNotes && <View style={styles.noteDot} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.notesButton}
            onPress={() => navigation.navigate('notes_main')}
          >
            <Text style={styles.notesButtonText}>📝 Mis Notas</Text>
          </TouchableOpacity>

          {selectedDate && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setCreateModalVisible(true)}
            >
              <Text style={styles.addButtonText}>+ Recordatorio</Text>
            </TouchableOpacity>
          )}
        </View>

       
        {selectedDate && (
          <View style={styles.selectedDateContainer}>
            <Text style={styles.selectedDateText}>
              {formatDisplayDate(selectedDate)}
            </Text>
            <Text style={styles.remindersCount}>
              {notes[selectedDate] ? notes[selectedDate].length : 0} recordatorios
            </Text>
          </View>
        )}

        
        <Modal
          animationType="slide"
          transparent={true}
          visible={viewModalVisible}
          onRequestClose={() => setViewModalVisible(false)}
        >
          <View style={styles.viewModalOverlay}>
            <View style={styles.viewModalContent}>
              
              <View style={styles.viewModalHeader}>
                <Text style={styles.viewModalTitle}>
                  {formatDisplayDate(selectedDate)}
                </Text>
                <Text style={styles.viewModalSubtitle}>
                  {selectedDateNotes.length} recordatorio{selectedDateNotes.length !== 1 ? 's' : ''}
                </Text>
                <TouchableOpacity
                  style={styles.viewModalCloseButton}
                  onPress={() => setViewModalVisible(false)}
                >
                  <Text style={styles.viewModalCloseText}>×</Text>
                </TouchableOpacity>
              </View>

              
              <FlatList
                data={selectedDateNotes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.reminderItem}>
                    <View style={styles.reminderContent}>
                      <Text style={styles.reminderTitle}>{item.title}</Text>
                      {item.content && (
                        <Text style={styles.reminderText}>{item.content}</Text>
                      )}
                    </View>
                    <TouchableOpacity 
                      style={styles.reminderDeleteButton}
                      onPress={() => deleteNote(item.id)}
                    >
                      <Text style={styles.reminderDeleteText}>×</Text>
                    </TouchableOpacity>
                  </View>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyReminders}>
                    <Text style={styles.emptyRemindersText}>
                      No hay recordatorios para esta fecha
                    </Text>
                  </View>
                }
                style={styles.remindersList}
              />

              
              <TouchableOpacity
                style={styles.addMoreButton}
                onPress={() => {
                  setViewModalVisible(false);
                  setCreateModalVisible(true);
                }}
              >
                <Text style={styles.addMoreButtonText}>+ Agregar Recordatorio</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        
        <Modal
          animationType="slide"
          transparent={true}
          visible={createModalVisible}
          onRequestClose={() => setCreateModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.createModalOverlay}>
              <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
              >
                <TouchableWithoutFeedback>
                  <View style={styles.createModalContent}>
                    <View style={styles.createModalHeader}>
                      <Text style={styles.createModalTitle}>Nuevo Recordatorio</Text>
                      <TouchableOpacity
                        style={styles.createModalCloseButton}
                        onPress={() => setCreateModalVisible(false)}
                      >
                        <Text style={styles.createModalCloseText}>×</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.createModalDate}>{formatDisplayDate(selectedDate)}</Text>
                    
                    <ScrollView 
                      style={styles.createModalForm}
                      showsVerticalScrollIndicator={false}
                      keyboardShouldPersistTaps="handled"
                    >
                      <Text style={styles.inputLabel}>Título del recordatorio *</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Escribe el título aquí..."
                        placeholderTextColor="#999"
                        value={newNote.title}
                        onChangeText={(text) => setNewNote({...newNote, title: text})}
                        returnKeyType="next"
                        autoFocus={true}
                      />
                      
                      <Text style={styles.inputLabel}>Descripción (opcional)</Text>
                      <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Agrega una descripción detallada..."
                        placeholderTextColor="#999"
                        value={newNote.content}
                        onChangeText={(text) => setNewNote({...newNote, content: text})}
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                        blurOnSubmit={true}
                      />
                    </ScrollView>
                    
                    <View style={styles.createModalButtons}>
                      <TouchableOpacity 
                        style={[styles.modalButton, styles.cancelButton]}
                        onPress={() => setCreateModalVisible(false)}
                      >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.modalButton, styles.saveButton]}
                        onPress={handleCreateNote}
                        disabled={isSaving}
                      >
                        <Text style={styles.saveButtonText}>
                          {isSaving ? 'Guardando...' : 'Guardar Recordatorio'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
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
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7fafc',
  },
  navButton: {
    padding: 12,
    backgroundColor: '#667eea',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  calendarContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 10,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    borderRadius: 22,
    position: 'relative',
  },
  dayText: {
    fontSize: 16,
    color: '#2d3748',
    fontWeight: '500',
  },
  otherMonthText: {
    color: '#cbd5e0',
  },
  selectedDay: {
    backgroundColor: '#667eea',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  todayDay: {
    borderWidth: 2,
    borderColor: '#667eea',
  },
  todayText: {
    color: '#667eea',
    fontWeight: 'bold',
  },
  hasNotesDay: {
    backgroundColor: '#fed7d7',
  },
  noteDot: {
    position: 'absolute',
    bottom: 3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e53e3e',
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  notesButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#667eea',
  },
  notesButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedDateContainer: {
    padding: 15,
    backgroundColor: '#f7fafc',
    marginHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    textAlign: 'center',
  },
  remindersCount: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
    marginTop: 4,
  },

  
  viewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  viewModalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '95%', 
    height: '85%', 
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  viewModalHeader: {
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    alignItems: 'center',
  },
  viewModalTitle: {
    fontSize: 22, 
    fontWeight: 'bold',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 8,
  },
  viewModalSubtitle: {
    fontSize: 16, 
    color: '#667eea',
    fontWeight: '600',
  },
  viewModalCloseButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    padding: 8,
    backgroundColor: '#f7fafc',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewModalCloseText: {
    fontSize: 24,
    color: '#718096',
    fontWeight: 'bold',
  },
  remindersList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#fafafa',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 12,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 18, 
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 6,
  },
  reminderText: {
    fontSize: 16, 
    color: '#718096',
    lineHeight: 20,
  },
  reminderDeleteButton: {
    padding: 10,
    backgroundColor: '#fed7d7',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderDeleteText: {
    fontSize: 20,
    color: '#e53e3e',
    fontWeight: 'bold',
  },
  emptyReminders: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyRemindersText: {
    color: '#718096',
    fontSize: 18, 
    fontStyle: 'italic',
    textAlign: 'center',
  },
  addMoreButton: {
    backgroundColor: '#667eea',
    margin: 20,
    padding: 18, 
    borderRadius: 15,
    alignItems: 'center',
  },
  addMoreButtonText: {
    color: 'white',
    fontSize: 18, 
    fontWeight: '600',
  },

  createModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  keyboardAvoidingView: {
    width: '100%',
    height: '90%', 
  },
  createModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25, 
    width: '100%',
    height: '100%', 
  },
  createModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  createModalTitle: {
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#2d3748',
    flex: 1,
  },
  createModalCloseButton: {
    padding: 8,
    backgroundColor: '#f7fafc',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createModalCloseText: {
    fontSize: 24,
    color: '#718096',
    fontWeight: 'bold',
  },
  createModalDate: {
    fontSize: 18, 
    color: '#667eea',
    marginBottom: 25,
    textAlign: 'center',
    fontWeight: '600',
    padding: 12,
    backgroundColor: '#f0f4ff',
    borderRadius: 12,
  },
  createModalForm: {
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
    minHeight: 180, 
    textAlignVertical: 'top',
    paddingTop: 18,
    lineHeight: 24,
  },
  createModalButtons: {
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
});