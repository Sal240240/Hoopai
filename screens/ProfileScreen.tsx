import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useTheme } from '../context/ThemeContext';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

export default function ProfileScreen({ navigation }: Props) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        Alert.alert(
          'Check your email',
          'We sent you a confirmation link. Please check your email to confirm your account.',
          [
            {
              text: 'OK',
              onPress: () => setIsSignUp(false),
            },
          ]
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      if (err.message.includes('Email not confirmed')) {
        Alert.alert(
          'Email not confirmed',
          'Please check your email for the confirmation link. Would you like us to resend it?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Resend',
              onPress: async () => {
                const { error } = await supabase.auth.resend({
                  type: 'signup',
                  email,
                });
                if (error) {
                  Alert.alert('Error', error.message);
                } else {
                  Alert.alert('Success', 'Confirmation email sent!');
                }
              },
            },
          ]
        );
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}>
      <View style={[styles.header, { backgroundColor: isDarkMode ? '#1a1a1a' : '#7851a9' }]}>
        <Image
          source={require('../assets/Hoop_AI__2_-removebg-preview.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: '#fff' }]}>
          {session ? 'Profile' : 'Sign In'}
        </Text>
      </View>

      {session ? (
        <View style={styles.profileContent}>
          <View style={styles.profileInfo}>
            <Icon name="account-circle" size={80} color="#7851a9" />
            <Text style={[styles.email, { color: isDarkMode ? '#fff' : '#333' }]}>
              {session.user.email}
            </Text>
          </View>

          <View style={[styles.statsContainer, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={[styles.statLabel, { color: isDarkMode ? '#fff' : '#666' }]}>Workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.2</Text>
              <Text style={[styles.statLabel, { color: isDarkMode ? '#fff' : '#666' }]}>Avg Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2.5h</Text>
              <Text style={[styles.statLabel, { color: isDarkMode ? '#fff' : '#666' }]}>This Week</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.authContent}>
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <TextInput
            style={[styles.input, { 
              backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
              color: isDarkMode ? '#fff' : '#000'
            }]}
            placeholder="Email"
            placeholderTextColor={isDarkMode ? '#999' : '#666'}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={[styles.input, { 
              backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
              color: isDarkMode ? '#fff' : '#000'
            }]}
            placeholder="Password"
            placeholderTextColor={isDarkMode ? '#999' : '#666'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.buttonText}>Loading...</Text>
            ) : (
              <Text style={styles.buttonText}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsSignUp(!isSignUp)}
          >
            <Text style={[styles.switchButtonText, { color: isDarkMode ? '#fff' : '#7851a9' }]}>
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileContent: {
    padding: 20,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  email: {
    fontSize: 16,
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7851a9',
  },
  statLabel: {
    color: '#666',
    marginTop: 5,
  },
  signOutButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  authContent: {
    padding: 20,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#7851a9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#7851a9',
    fontSize: 14,
  },
  errorText: {
    color: '#ff4444',
    marginBottom: 15,
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#7851a9',
  },
}); 