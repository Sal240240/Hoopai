import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  useColorScheme,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { supabase } from '../lib/supabase';

type AuthScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

interface Props {
  navigation: AuthScreenNavigationProp;
}

export default function AuthScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDarkMode = useColorScheme() === 'dark';

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
                try {
                  const { error } = await supabase.auth.resend({
                    type: 'signup',
                    email,
                  });
                  if (error) throw error;
                  Alert.alert('Success', 'Confirmation email has been resent!');
                } catch (error: any) {
                  Alert.alert('Error', error.message);
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

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }]}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/Hoop_AI__2_-removebg-preview.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={[styles.formContainer, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
        <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#7851a9' }]}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </Text>

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <TextInput
          style={[styles.input, { 
            backgroundColor: isDarkMode ? '#444' : '#f5f5f5',
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
            backgroundColor: isDarkMode ? '#444' : '#f5f5f5',
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
            <ActivityIndicator color="#fff" />
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
          <Text style={[styles.switchText, { color: isDarkMode ? '#fff' : '#7851a9' }]}>
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 100,
  },
  formContainer: {
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#7851a9',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 16,
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 15,
  },
}); 