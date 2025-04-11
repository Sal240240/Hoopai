import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, useColorScheme } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface WorkoutLog {
  date: string;
  notes: string;
  duration: number;
  type: string;
}

export default function WorkoutTrackerScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [workoutLogs, setWorkoutLogs] = useState<{ [key: string]: WorkoutLog }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLog, setCurrentLog] = useState<WorkoutLog>({
    date: '',
    notes: '',
    duration: 30,
    type: 'Shooting'
  });
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    loadWorkoutLogs();
  }, []);

  const loadWorkoutLogs = async () => {
    try {
      const savedLogs = await AsyncStorage.getItem('workoutLogs');
      if (savedLogs) {
        setWorkoutLogs(JSON.parse(savedLogs));
      }
    } catch (error) {
      console.error('Error loading workout logs:', error);
    }
  };

  const saveWorkoutLog = async (log: WorkoutLog) => {
    try {
      const updatedLogs = { ...workoutLogs, [log.date]: log };
      await AsyncStorage.setItem('workoutLogs', JSON.stringify(updatedLogs));
      setWorkoutLogs(updatedLogs);
    } catch (error) {
      console.error('Error saving workout log:', error);
    }
  };

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    const existingLog = workoutLogs[day.dateString];
    setCurrentLog(existingLog || {
      date: day.dateString,
      notes: '',
      duration: 30,
      type: 'Shooting'
    });
    setModalVisible(true);
  };

  const getMarkedDates = () => {
    const marked: any = {};
    Object.keys(workoutLogs).forEach(date => {
      marked[date] = {
        marked: true,
        dotColor: '#7851a9',
        selected: date === selectedDate,
        selectedColor: '#7851a9'
      };
    });
    return marked;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }]}>
      <View style={[styles.header, { backgroundColor: isDarkMode ? '#2a2a2a' : '#7851a9' }]}>
        <Text style={styles.headerTitle}>Workout Journal</Text>
      </View>

      <Calendar
        theme={{
          calendarBackground: isDarkMode ? '#2a2a2a' : '#fff',
          textSectionTitleColor: isDarkMode ? '#fff' : '#7851a9',
          selectedDayBackgroundColor: '#7851a9',
          selectedDayTextColor: '#fff',
          todayTextColor: '#7851a9',
          dayTextColor: isDarkMode ? '#fff' : '#2d4150',
          textDisabledColor: isDarkMode ? '#444' : '#d9e1e8',
          monthTextColor: isDarkMode ? '#fff' : '#7851a9',
        }}
        markedDates={getMarkedDates()}
        onDayPress={handleDayPress}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#2a2a2a' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
              Log Workout for {selectedDate}
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Workout Type</Text>
              <View style={styles.typeButtons}>
                {['Shooting', 'Dribbling', 'Conditioning', 'Full Practice'].map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      currentLog.type === type && styles.selectedType
                    ]}
                    onPress={() => setCurrentLog({ ...currentLog, type })}
                  >
                    <Text style={[
                      styles.typeText,
                      currentLog.type === type && styles.selectedTypeText
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Duration (minutes)</Text>
              <TextInput
                style={[styles.input, { color: isDarkMode ? '#fff' : '#000', borderColor: isDarkMode ? '#444' : '#ccc' }]}
                value={String(currentLog.duration)}
                onChangeText={(text) => setCurrentLog({ ...currentLog, duration: parseInt(text) || 0 })}
                keyboardType="numeric"
                placeholder="Enter duration"
                placeholderTextColor={isDarkMode ? '#888' : '#666'}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Notes</Text>
              <TextInput
                style={[styles.input, styles.notesInput, { color: isDarkMode ? '#fff' : '#000', borderColor: isDarkMode ? '#444' : '#ccc' }]}
                value={currentLog.notes}
                onChangeText={(text) => setCurrentLog({ ...currentLog, notes: text })}
                multiline
                placeholder="Add workout notes..."
                placeholderTextColor={isDarkMode ? '#888' : '#666'}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={() => {
                  saveWorkoutLog(currentLog);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {selectedDate && workoutLogs[selectedDate] && (
        <View style={[styles.logDisplay, { backgroundColor: isDarkMode ? '#2a2a2a' : '#fff' }]}>
          <Text style={[styles.logTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
            {workoutLogs[selectedDate].type} Workout
          </Text>
          <Text style={[styles.logDetail, { color: isDarkMode ? '#ccc' : '#666' }]}>
            Duration: {workoutLogs[selectedDate].duration} minutes
          </Text>
          <Text style={[styles.logDetail, { color: isDarkMode ? '#ccc' : '#666' }]}>
            Notes: {workoutLogs[selectedDate].notes}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7851a9',
  },
  selectedType: {
    backgroundColor: '#7851a9',
  },
  typeText: {
    color: '#7851a9',
  },
  selectedTypeText: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  saveButton: {
    backgroundColor: '#7851a9',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  logDisplay: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  logDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
}); 