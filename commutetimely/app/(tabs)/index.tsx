import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';

type CommuteMode = 'Walk' | 'Drive' | 'Bus' | 'Train';

interface LeaveTimeResult {
  arrivalTime: Date;
  leaveTime: Date;
  commuteMode: CommuteMode;
  duration: number;
}

type Screen = 'home' | 'planner' | 'result';

// Mock commute duration estimates
const COMMUTE_DURATIONS: Record<CommuteMode, number> = {
  Walk: 15,
  Drive: 10,
  Bus: 25,
  Train: 20,
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const estimateLeaveTime = (arrivalTime: Date, commuteMode: CommuteMode): LeaveTimeResult => {
  const duration = COMMUTE_DURATIONS[commuteMode];
  const leaveTime = new Date(arrivalTime.getTime() - duration * 60 * 1000);
  
  return {
    arrivalTime,
    leaveTime,
    commuteMode,
    duration,
  };
};

export default function CommuteTimelyApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [result, setResult] = useState<LeaveTimeResult | null>(null);
  const [commuteMode, setCommuteMode] = useState<CommuteMode | null>(null);
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [arrivalTime, setArrivalTime] = useState<Date | null>(null);

  const handleGetStarted = () => {
    setCurrentScreen('planner');
  };

  const handleCalculate = () => {
    if (!commuteMode) {
      Alert.alert('Error', 'Please select a commute mode');
      return;
    }
    if (!startLocation.trim()) {
      Alert.alert('Error', 'Please enter a start location');
      return;
    }
    if (!destination.trim()) {
      Alert.alert('Error', 'Please enter a destination');
      return;
    }
    if (!arrivalTime) {
      Alert.alert('Error', 'Please select an arrival time');
      return;
    }

    const calculationResult = estimateLeaveTime(arrivalTime, commuteMode);
    setResult(calculationResult);
    setCurrentScreen('result');
  };

  const handlePlanAnother = () => {
    setCurrentScreen('planner');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const renderHomeScreen = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>CT</Text>
        </View>
        <Text style={styles.title}>CommuteTimely</Text>
        <Text style={styles.description}>
          Plan your commute with precision.{'\n'}
          Arrive on time, every time.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  const renderPlannerScreen = () => (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Plan Your Commute</Text>
          <Text style={styles.subtitle}>Enter your details to calculate the perfect leave time</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Commute Mode</Text>
          <View style={styles.optionsContainer}>
            {(['Walk', 'Drive', 'Bus', 'Train'] as CommuteMode[]).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[styles.option, commuteMode === mode && styles.selectedOption]}
                onPress={() => setCommuteMode(mode)}
              >
                <Text style={[styles.optionText, commuteMode === mode && styles.selectedOptionText]}>
                  {mode}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Start Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your starting point"
            value={startLocation}
            onChangeText={setStartLocation}
          />

          <Text style={styles.label}>Destination</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your destination"
            value={destination}
            onChangeText={setDestination}
          />

          <Text style={styles.label}>Arrival Time</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              // Simple time picker - set to 9 AM for demo
              const time = new Date();
              time.setHours(9, 0, 0, 0);
              setArrivalTime(time);
            }}
          >
            <Text style={arrivalTime ? styles.inputText : styles.placeholderText}>
              {arrivalTime ? formatTime(arrivalTime) : 'Select time (tap for 9:00 AM)'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleCalculate}>
            <Text style={styles.buttonText}>Calculate Leave Time</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const renderResultScreen = () => {
    if (!result) return null;

    const getCommuteIcon = (mode: CommuteMode) => {
      switch (mode) {
        case 'Walk': return '🚶';
        case 'Drive': return '🚗';
        case 'Bus': return '🚌';
        case 'Train': return '🚆';
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Your Commute Plan</Text>
            <Text style={styles.subtitle}>Here's when you should leave to arrive on time</Text>
          </View>

          <View style={styles.resultCard}>
            <View style={styles.commuteBadge}>
              <Text style={styles.commuteIcon}>{getCommuteIcon(result.commuteMode)}</Text>
              <Text style={styles.commuteModeText}>{result.commuteMode}</Text>
            </View>

            <View style={styles.mainResult}>
              <Text style={styles.resultLabel}>To arrive by</Text>
              <Text style={styles.arrivalTime}>{formatTime(result.arrivalTime)}</Text>
              <Text style={styles.resultLabel}>leave by</Text>
              <Text style={styles.leaveTime}>{formatTime(result.leaveTime)}</Text>
            </View>

            <View style={styles.additionalInfo}>
              <Text style={styles.durationText}>
                Estimated travel time: <Text style={styles.durationBold}>{result.duration} minutes</Text>
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handlePlanAnother}>
              <Text style={styles.buttonText}>Plan Another Trip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleBackToHome}>
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return renderHomeScreen();
      case 'planner':
        return renderPlannerScreen();
      case 'result':
        return renderResultScreen();
      default:
        return renderHomeScreen();
    }
  };

  return renderScreen();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#3B82F6',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  header: {
    marginBottom: 32,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  label: {
    color: '#374151',
    fontWeight: '500',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  inputText: {
    color: '#111827',
  },
  placeholderText: {
    color: '#6B7280',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#3B82F6',
  },
  optionText: {
    color: '#374151',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#E5E7EB',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#374151',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  commuteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  commuteIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  commuteModeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  mainResult: {
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  resultLabel: {
    color: '#1E40AF',
    fontSize: 16,
    marginBottom: 8,
  },
  arrivalTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 16,
  },
  leaveTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#059669',
  },
  additionalInfo: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  durationText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  durationBold: {
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 12,
  },
});
