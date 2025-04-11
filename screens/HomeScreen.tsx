import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ImageBackground, ActivityIndicator, TextInput, Animated, useColorScheme, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import WorkoutPreviewScreen from './WorkoutPreviewScreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, TabParamList } from '../App';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTheme } from '../context/ThemeContext';
import { generateWorkout } from '../services/aiService';
import { Workout, Exercise } from '../types/workout';

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, 'MainTabs'>,
  BottomTabNavigationProp<TabParamList>
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const { width } = Dimensions.get('window');

type DifficultyLevel = 'Beginner' | 'High School' | 'College' | 'Pro';

interface WorkoutTemplates {
  [key: string]: Exercise[];
}

interface StatCardProps {
  number: string;
  label: string;
  icon: string;
}

const DIFFICULTIES = ['Beginner', 'High School', 'College', 'Pro'];

const StatCard = ({ number, label, icon }: StatCardProps) => (
  <View style={styles.statCard}>
    <Icon name={icon} size={24} color="#7851a9" />
    <Text style={styles.statNumber}>{number}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const WORKOUT_TEMPLATES: WorkoutTemplates = {
  'Beginner': [
    { name: "Basic Dribbling", sets: 3, reps: "1 minute", rest: "30 seconds", description: "Practice basic dribbling while walking" },
    { name: "Form Shooting", sets: 4, reps: "10 shots", rest: "30 seconds", description: "Practice shooting form close to basket" },
    { name: "Layup Practice", sets: 3, reps: "5 each side", rest: "1 minute", description: "Basic layup practice from both sides" },
    { name: "Free Throws", sets: 2, reps: "10 shots", rest: "1 minute", description: "Practice free throws" }
  ],
  'High School': [
    { name: "Speed Dribbling", sets: 4, reps: "2 minutes", rest: "45 seconds", description: "High-speed dribbling drills" },
    { name: "Jump Shots", sets: 4, reps: "15 shots", rest: "1 minute", description: "Mid-range jump shots from different spots" },
    { name: "Defensive Slides", sets: 3, reps: "30 seconds", rest: "30 seconds", description: "Defensive movement practice" },
    { name: "Ball Handling", sets: 3, reps: "2 minutes", rest: "1 minute", description: "Advanced dribbling combinations" }
  ],
  'College': [
    { name: "Full Court Sprints", sets: 5, reps: "Court length", rest: "30 seconds", description: "Sprint with ball control" },
    { name: "Three Point Shots", sets: 5, reps: "10 shots", rest: "1 minute", description: "Three-point shots from 5 positions" },
    { name: "Pick and Roll", sets: 4, reps: "5 each side", rest: "1 minute", description: "Pick and roll combinations" },
    { name: "Conditioning", sets: 3, reps: "3 minutes", rest: "1 minute", description: "High-intensity basketball drills" }
  ],
  'Pro': [
    { name: "Elite Ball Handling", sets: 5, reps: "3 minutes", rest: "45 seconds", description: "Complex dribbling patterns" },
    { name: "Game Speed Shots", sets: 6, reps: "8 shots", rest: "30 seconds", description: "Quick release shots under pressure" },
    { name: "Advanced Footwork", sets: 4, reps: "2 minutes", rest: "1 minute", description: "Pro-level footwork drills" },
    { name: "Endurance Training", sets: 4, reps: "4 minutes", rest: "1 minute", description: "Full-court intensive drills" }
  ]
};

export default function HomeScreen({ navigation }: Props) {
  const [prompt, setPrompt] = useState('');
  const [difficulty, setDifficulty] = useState(0);
  const [duration, setDuration] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const colorScheme = useColorScheme();

  // Animation values
  const buttonScale = useRef(new Animated.Value(1)).current;
  const difficultyButtonScales = useRef(DIFFICULTIES.map(() => new Animated.Value(1))).current;
  const generateButtonRotation = useRef(new Animated.Value(0)).current;

  const animateButton = (scale: Animated.Value) => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleGenerateWorkout = async () => {
    if (!prompt.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter your workout goals to generate a workout.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsGenerating(true);
    try {
      // Start rotation animation
      Animated.loop(
        Animated.timing(generateButtonRotation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();

      const difficultyLevel = ['Beginner', 'High School', 'College', 'Pro'][difficulty];
      const workout = await generateWorkout(prompt.trim(), difficultyLevel, duration);
      
      // Stop rotation animation
      generateButtonRotation.setValue(0);
      
      navigation.navigate('WorkoutPreview', { workout });
    } catch (error) {
      console.error('Error generating workout:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to generate workout. Please try again.',
        [{ text: 'OK' }]
      );
      // Stop rotation animation
      generateButtonRotation.setValue(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDifficultyPress = (index: number) => {
    setDifficulty(index);
    animateButton(difficultyButtonScales[index]);
  };

  return (
    <ImageBackground
      source={require('../assets/BE GREAT.png')}
      style={styles.backgroundImage}
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(245,245,245,0.9)' }]} 
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { backgroundColor: isDarkMode ? '#1a1a1a' : '#7851a9' }]}>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={toggleDarkMode}
          >
            <Icon 
              name={isDarkMode ? 'light-mode' : 'dark-mode'} 
              size={40} 
              color="#fff"
            />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.welcomeText, { color: '#fff' }]}>Welcome back!</Text>
              <Text style={[styles.subtitle, { color: '#fff' }]}>Ready for your workout?</Text>
            </View>
          </View>
          <Image
            source={require('../assets/Hoop_AI__2_-removebg-preview.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.aiWorkoutSection, { backgroundColor: isDarkMode ? '#1a1a1a' : 'white' }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#7851a9' }]}>Generate Your Workout</Text>
          <View style={styles.promptContainer}>
            <TextInput
              style={[styles.promptInput, { 
                backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                color: isDarkMode ? '#fff' : '#000'
              }]}
              placeholder="Describe your workout goals..."
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              value={prompt}
              onChangeText={setPrompt}
              multiline
              editable={!isGenerating}
            />
            <Animated.View style={{
              transform: [
                { scale: buttonScale },
                { rotate: generateButtonRotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg']
                })}
              ]
            }}>
              <TouchableOpacity 
                style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
                onPress={handleGenerateWorkout}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Icon name="fitness-center" size={24} color="#fff" />
                    <Text style={styles.generateButtonText}>Generate Workout</Text>
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>

          <View style={styles.settingsContainer}>
            <View style={styles.settingSection}>
              <Text style={[styles.settingLabel, { color: isDarkMode ? '#fff' : '#333' }]}>Difficulty</Text>
              <View style={styles.difficultyButtons}>
                {DIFFICULTIES.map((level, index) => (
                  <Animated.View
                    key={level}
                    style={{
                      transform: [{ scale: difficultyButtonScales[index] }]
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.difficultyButton,
                        difficulty === index && styles.difficultyButtonActive
                      ]}
                      onPress={() => handleDifficultyPress(index)}
                    >
                      <Text style={[
                        styles.difficultyButtonText,
                        difficulty === index && styles.difficultyButtonTextActive
                      ]}>{level}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </View>

            <View style={styles.settingSection}>
              <Text style={[styles.settingLabel, { color: isDarkMode ? '#fff' : '#333' }]}>Duration: {duration} minutes</Text>
              <Slider
                style={styles.slider}
                minimumValue={15}
                maximumValue={120}
                step={15}
                value={duration}
                onValueChange={setDuration}
                minimumTrackTintColor="#7851a9"
                maximumTrackTintColor="#ddd"
                thumbTintColor="#7851a9"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.trackerButton, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}
          onPress={() => navigation.navigate('WorkoutTracker')}
        >
          <Icon name="calendar-today" size={24} color={isDarkMode ? '#fff' : '#7851a9'} />
          <Text style={[styles.trackerButtonText, { color: isDarkMode ? '#fff' : '#7851a9' }]}>
            View Workout Tracker
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.startButton, { backgroundColor: isDarkMode ? '#333' : '#fff' }]} 
          activeOpacity={0.8}
          onPress={toggleDarkMode}
        >
          <Icon 
            name={isDarkMode ? 'light-mode' : 'dark-mode'} 
            size={24} 
            color={isDarkMode ? '#fff' : '#7851a9'} 
            style={styles.startButtonIcon} 
          />
          <Text style={[styles.startButtonText, { color: isDarkMode ? '#fff' : '#7851a9' }]}>
            {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#7851a9',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  headerLogo: {
    width: width * 0.4,
    height: 60,
    alignSelf: 'center',
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontFamily: 'System',
    fontWeight: '800',
    color: '#7851a9',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '600',
    color: '#7851a9',
    opacity: 0.8,
    marginTop: 5,
    textAlign: 'center',
  },
  profileButton: {
    padding: 5,
    position: 'absolute',
    right: 20,
    top: 60,
    zIndex: 1,
  },
  aiWorkoutSection: {
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'System',
    fontWeight: '700',
    color: '#7851a9',
    textAlign: 'center',
    marginBottom: 20,
  },
  promptContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  promptInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  generateButton: {
    backgroundColor: '#7851a9',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  settingsContainer: {
    marginTop: 20,
  },
  settingSection: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  difficultyButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  difficultyButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#7851a9',
    shadowColor: '#7851a9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  difficultyButtonActive: {
    backgroundColor: '#7851a9',
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  difficultyButtonText: {
    color: '#7851a9',
    fontWeight: '600',
  },
  difficultyButtonTextActive: {
    color: '#FFD700',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  quickStats: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    width: width * 0.4,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#7851a9',
    shadowColor: '#7851a9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7851a9',
    marginTop: 5,
  },
  statLabel: {
    color: '#666',
    marginTop: 5,
    fontSize: 12,
  },
  trackerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#7851a9',
    shadowColor: '#7851a9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  trackerButtonText: {
    color: '#7851a9',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  startButton: {
    margin: 20,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#7851a9',
    shadowColor: '#7851a9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonIcon: {
    marginRight: 10,
  },
  startButtonText: {
    color: '#7851a9',
    fontSize: 18,
    fontWeight: '600',
  },
  generateButtonDisabled: {
    opacity: 0.8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 