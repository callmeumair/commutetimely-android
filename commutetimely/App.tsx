import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SplashScreen } from './src/screens/SplashScreen';
import { LandingScreen } from './src/screens/LandingScreen';
import { PlannerScreen } from './src/screens/PlannerScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { RootStackParamList, LeaveTimeResult } from './src/types';
import './global.css';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'app'>('splash');

  const handleSplashComplete = () => {
    setCurrentScreen('app');
  };

  if (currentScreen === 'splash') {
    return <SplashScreen onAnimationComplete={handleSplashComplete} />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            };
          },
        }}
      >
        <Stack.Screen name="Landing" component={LandingScreenWrapper} />
        <Stack.Screen name="Planner" component={PlannerScreenWrapper} />
        <Stack.Screen name="Result" component={ResultScreenWrapper} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Wrapper components to handle navigation props
const LandingScreenWrapper = ({ navigation }: any) => (
  <LandingScreen onGetStarted={() => navigation.navigate('Planner')} />
);

const PlannerScreenWrapper = ({ navigation, route }: any) => (
  <PlannerScreen 
    onCalculate={(result: LeaveTimeResult) => {
      navigation.navigate('Result', { result });
    }}
  />
);

const ResultScreenWrapper = ({ navigation, route }: any) => (
  <ResultScreen
    result={route.params?.result}
    onPlanAnother={() => navigation.navigate('Planner')}
    onBackToHome={() => navigation.navigate('Landing')}
  />
); 