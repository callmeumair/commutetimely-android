import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, CommuteMode, Location } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Dropdown } from '../components/Dropdown';
import { TimePicker } from '../components/TimePicker';
import { estimateLeaveTime } from '../utils/estimateLeaveTime';

type PlannerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Planner'>;

interface PlannerScreenProps {
  navigation: PlannerScreenNavigationProp;
}

export const PlannerScreen: React.FC<PlannerScreenProps> = ({ navigation }) => {
  const [commuteMode, setCommuteMode] = useState<CommuteMode | null>(null);
  const [startLocation, setStartLocation] = useState<Location>({ name: '' });
  const [destinationLocation, setDestinationLocation] = useState<Location>({ name: '' });
  const [arrivalTime, setArrivalTime] = useState<Date | null>(null);

  const commuteOptions: CommuteMode[] = ['Walk', 'Drive', 'Bus', 'Train'];

  const handleCalculate = () => {
    // Validate form
    if (!commuteMode) {
      Alert.alert('Error', 'Please select a commute mode');
      return;
    }

    if (!startLocation.name.trim()) {
      Alert.alert('Error', 'Please enter a start location');
      return;
    }

    if (!destinationLocation.name.trim()) {
      Alert.alert('Error', 'Please enter a destination');
      return;
    }

    if (!arrivalTime) {
      Alert.alert('Error', 'Please select an arrival time');
      return;
    }

    // Calculate leave time
    const result = estimateLeaveTime(arrivalTime, commuteMode);

    // Navigate to result screen
    navigation.navigate('Result', { result });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6 py-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Plan Your Commute
          </Text>
          <Text className="text-gray-600 text-base">
            Enter your details to calculate the perfect leave time
          </Text>
        </View>

        {/* Form */}
        <View className="bg-white rounded-xl p-6 shadow-sm">
          {/* Commute Mode */}
          <Dropdown
            label="Commute Mode"
            value={commuteMode}
            onValueChange={setCommuteMode}
            options={commuteOptions}
            placeholder="Select your commute mode"
          />

          {/* Start Location */}
          <Input
            label="Start Location"
            placeholder="Enter your starting point"
            value={startLocation.name}
            onChangeText={(text) => setStartLocation({ name: text })}
          />

          {/* Destination */}
          <Input
            label="Destination"
            placeholder="Enter your destination"
            value={destinationLocation.name}
            onChangeText={(text) => setDestinationLocation({ name: text })}
          />

          {/* Arrival Time */}
          <TimePicker
            label="Arrival Time"
            value={arrivalTime}
            onValueChange={setArrivalTime}
            placeholder="Select when you want to arrive"
          />

          {/* Calculate Button */}
          <View className="mt-6">
            <Button
              title="Calculate Leave Time"
              size="large"
              onPress={handleCalculate}
              style={{ width: '100%' }}
            />
          </View>
        </View>

        {/* Info Section */}
        <View className="mt-8 bg-blue-50 rounded-xl p-6">
          <Text className="text-lg font-semibold text-blue-900 mb-2">
            How it works
          </Text>
          <Text className="text-blue-800 text-base leading-6">
            We calculate the optimal time to leave based on your commute mode and typical travel times. 
            The estimates are based on average conditions and may vary based on traffic, weather, and other factors.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}; 