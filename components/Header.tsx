import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const Header = () => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Image
            source={require('../assets/Hoop_AI__2_-removebg-preview.png')}
            style={styles.logo}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: '#1a1a1a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    zIndex: 100,
    elevation: 100,
  },
  rightContainer: {
    position: 'absolute',
    right: 16,
    zIndex: 101,
    elevation: 101,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});

export default Header; 