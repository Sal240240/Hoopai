import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeProvider, useTheme } from './context/ThemeContext';

import HomeScreen from './screens/HomeScreen';
import WorkoutPreviewScreen from './screens/WorkoutPreviewScreen';
import ActiveWorkoutScreen from './screens/ActiveWorkoutScreen';
import SplashScreen from './screens/SplashScreen';
import ProfileScreen from './screens/ProfileScreen';

export interface Exercise {
  name: string;
  description: string;
  sets: number;
  reps: string;
  rest: string;
}

export interface Workout {
  title: string;
  duration: number;
  difficulty: string;
  exercises: Exercise[];
}

export type RootStackParamList = {
  Splash: undefined;
  MainTabs: undefined;
  WorkoutPreview: {
    workout: Workout;
  };
  ActiveWorkout: {
    workout: Workout;
  };
};

export type TabParamList = {
  Home: undefined;
  WorkoutTracker: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  const { isDarkMode } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#7851a9',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? '#333' : '#eee',
        },
        headerStyle: {
          backgroundColor: isDarkMode ? '#1a1a1a' : '#7851a9',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          color: '#fff',
        },
      }}
    >

      
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="WorkoutTracker"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-today" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="WorkoutPreview" component={WorkoutPreviewScreen} />
            <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
} 