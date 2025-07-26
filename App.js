import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthScreen from './src/features/auth/AuthScreen';
import WelcomeScreen from './src/features/auth/WelcomeScreen';
import ChatScreen from './src/features/chat/ChatScreen';
import CheckinScreen from './src/features/checkin/CheckinScreen';
import MatchScreen from './src/features/match/MatchScreen';
import OnboardingScreen from './src/features/profile/OnboardingScreen';
import ProfileScreen from './src/features/profile/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  console.log('Rendering App component');
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Match" component={MatchScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Checkin" component={CheckinScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}