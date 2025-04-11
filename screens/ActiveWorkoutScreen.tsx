import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type ActiveWorkoutScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ActiveWorkout'>;

interface Props {
  navigation: ActiveWorkoutScreenNavigationProp;
  route: {
    params: {
      workout: {
        title: string;
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

const parseTime = (timeStr: string): number => {
  const minutes = timeStr.match(/(\d+)\s*minute/);
  const seconds = timeStr.match(/(\d+)\s*second/);
  
  if (minutes) {
    return parseInt(minutes[1]) * 60;
  } else if (seconds) {
    return parseInt(seconds[1]);
  }
  return 60; // Default to 60 seconds if parsing fails
};

export default function ActiveWorkoutScreen({ navigation, route }: Props) {
  const { workout } = route.params;
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);

  const currentExercise = workout.exercises[currentExerciseIndex];
  const restTime = parseTime(currentExercise.rest);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isPaused && !isWorkoutComplete) {
      if (isResting) {
        setTimeLeft(restTime);
        timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              setIsResting(false);
              if (currentSet < currentExercise.sets) {
                setCurrentSet((prev) => prev + 1);
                return restTime;
              } else {
                if (currentExerciseIndex < workout.exercises.length - 1) {
                  setCurrentExerciseIndex((prev) => prev + 1);
                  setCurrentSet(1);
                  setIsResting(false);
                  return 0;
                } else {
                  setIsWorkoutComplete(true);
                  return 0;
                }
              }
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setTimeLeft(0);
        timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev >= 60) {
              setIsResting(true);
              return restTime;
            }
            return prev + 1;
          });
        }, 1000);
      }
    }
    return () => clearInterval(timer);
  }, [isResting, currentSet, currentExerciseIndex, isPaused, isWorkoutComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSkip = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
      setTimeLeft(0);
    } else {
      setIsWorkoutComplete(true);
    }
  };

  const handleComplete = () => {
    setIsWorkoutComplete(true);
  };

  if (isWorkoutComplete) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
            <Icon name="home" size={24} color="#7851a9" />
          </TouchableOpacity>
          <Text style={styles.headerLogo}>Hoop AI</Text>
        </View>
        <View style={styles.completeContainer}>
          <Icon name="check-circle" size={80} color="#7851a9" />
          <Text style={styles.completeTitle}>Workout Complete!</Text>
          <Text style={styles.completeSubtitle}>Great job! You've finished your workout.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#7851a9" />
        </TouchableOpacity>
        <Text style={styles.headerLogo}>Hoop AI</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentExerciseIndex + 1) / workout.exercises.length) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
          </Text>
        </View>

        <View style={styles.exerciseContainer}>
          <Text style={styles.exerciseName}>{currentExercise.name}</Text>
          <Text style={styles.exerciseDescription}>{currentExercise.description}</Text>
          <Text style={styles.setInfo}>
            Set {currentSet} of {currentExercise.sets}
          </Text>
          <Text style={styles.repsInfo}>{currentExercise.reps}</Text>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
          <Text style={styles.timerLabel}>{isResting ? 'Rest' : 'Work'}</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={handleSkip}>
            <Icon name="skip-next" size={32} color="#7851a9" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, styles.playButton]}
            onPress={() => setIsPaused(!isPaused)}
          >
            <Icon
              name={isPaused ? 'play-arrow' : 'pause'}
              size={32}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={handleComplete}>
            <Icon name="stop" size={32} color="#7851a9" />
          </TouchableOpacity>
        </View>
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
    padding: 16,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7851a9',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  exerciseContainer: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  exerciseDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  setInfo: {
    fontSize: 18,
    color: '#7851a9',
    fontWeight: '600',
    marginBottom: 8,
  },
  repsInfo: {
    fontSize: 16,
    color: '#666',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#7851a9',
  },
  timerLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#7851a9',
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  completeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 