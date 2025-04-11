import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type WorkoutPreviewScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'WorkoutPreview'>;

interface Props {
  navigation: WorkoutPreviewScreenNavigationProp;
  route: {
    params: {
      workout: {
        title: string;
        duration: number;
        difficulty: string;
        exercises: Array<{
          name: string;
          description: string;
          sets: number;
          reps: string;
          rest: string;
        }>;
      };
    };
  };
}

const ExerciseCard = ({ exercise }: { exercise: Props['route']['params']['workout']['exercises'][0] }) => (
  <View style={styles.exerciseCard}>
    <View style={styles.exerciseHeader}>
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      <View style={styles.exerciseStats}>
        <Text style={styles.exerciseStat}>{exercise.sets} sets</Text>
        <Text style={styles.exerciseStat}>•</Text>
        <Text style={styles.exerciseStat}>{exercise.reps}</Text>
      </View>
    </View>
    <Text style={styles.exerciseDescription}>{exercise.description}</Text>
    <View style={styles.restTimeContainer}>
      <Icon name="timer" size={16} color="#7851a9" />
      <Text style={styles.restTime}>{exercise.rest} rest</Text>
    </View>
  </View>
);

export default function WorkoutPreviewScreen({ navigation, route }: Props) {
  const { workout } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#7851a9" />
        </TouchableOpacity>
        <Text style={styles.headerLogo}>Hoop AI</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.workoutInfo}>
          <Text style={styles.workoutTitle}>{workout.title}</Text>
          <View style={styles.workoutDetails}>
            <View style={styles.detailItem}>
              <Icon name="timer" size={20} color="#7851a9" />
              <Text style={styles.detailText}>{workout.duration} min</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="fitness-center" size={20} color="#7851a9" />
              <Text style={styles.detailText}>{workout.difficulty}</Text>
            </View>
          </View>
        </View>

        <View style={styles.exercisesList}>
          {workout.exercises.map((exercise, index) => (
            <ExerciseCard key={index} exercise={exercise} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.regenerateButton]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="refresh" size={24} color="#7851a9" />
          <Text style={styles.regenerateButtonText}>Regenerate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.startButton]}
          onPress={() => navigation.navigate('ActiveWorkout', { workout })}
        >
          <Icon name="play-arrow" size={24} color="#fff" />
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerLogo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7851a9',
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  workoutInfo: {
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  workoutDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
  },
  exercisesList: {
    padding: 16,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  exerciseStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exerciseStat: {
    fontSize: 14,
    color: '#666',
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  restTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  restTime: {
    fontSize: 14,
    color: '#7851a9',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  regenerateButton: {
    backgroundColor: '#f0f0f0',
  },
  regenerateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7851a9',
  },
  startButton: {
    backgroundColor: '#7851a9',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
}); 