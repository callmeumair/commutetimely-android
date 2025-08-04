import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { HomeScreen } from '../../src/screens/HomeScreen';
import { PlannerScreen } from '../../src/screens/PlannerScreen';
import { ResultScreen } from '../../src/screens/ResultScreen';
import { LeaveTimeResult } from '../../src/types';

type Screen = 'home' | 'planner' | 'result';

export default function CommuteTimelyApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [result, setResult] = useState<LeaveTimeResult | null>(null);

  const handleGetStarted = () => {
    setCurrentScreen('planner');
  };

  const handleCalculate = (calculationResult: LeaveTimeResult) => {
    setResult(calculationResult);
    setCurrentScreen('result');
  };

  const handlePlanAnother = () => {
    setCurrentScreen('planner');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onGetStarted={handleGetStarted} />;
      case 'planner':
        return <PlannerScreen onCalculate={handleCalculate} />;
      case 'result':
        return result ? (
          <ResultScreen 
            result={result} 
            onPlanAnother={handlePlanAnother} 
            onBackToHome={handleBackToHome} 
          />
        ) : null;
      default:
        return <HomeScreen onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
