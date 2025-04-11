import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Layout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#1a1a1a' : '#fff',
        },
        tabBarStyle: {
          backgroundColor: isDark ? '#1a1a1a' : '#fff',
        },
        tabBarActiveTintColor: '#7851a9',
        tabBarInactiveTintColor: isDark ? '#888' : '#666',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'My HOME',
          tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="workout-tracker"
        options={{
          title: 'Tracker',
          tabBarIcon: ({ color }) => <Icon name="calendar-today" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Icon name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
} 