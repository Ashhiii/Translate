import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/IntroScreen/intro';
import DashboardScreen from './src/Homes/Dashboard';
import TranslateScreen from './src/Translate/Translator';
import TranslationDetailScreen from './src/Details/TranslationDetail'; 


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Translate" component={TranslateScreen} />
        <Stack.Screen name="Details" component={TranslationDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
