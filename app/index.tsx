import React from 'react';
import { View, Text, Image } from 'react-native';

export default function Index() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={require('../assets/Hoop_AI__1_-removebg-preview.png')}
        style={{
          width: 100,
          height: 100,
          resizeMode: 'contain',
        }}
      />
      <Text>Welcome to Hoop AI!</Text>
    </View>
  );
} 