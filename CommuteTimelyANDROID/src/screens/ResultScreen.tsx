import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, LeaveTimeResult } from '../types';
import { Button } from '../components/Button';
import { formatTime, formatDate } from '../utils/estimateLeaveTime';

type ResultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Result'>;
type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

interface ResultScreenProps {
  navigation: ResultScreenNavigationProp;
  route: ResultScreenRouteProp;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ navigation, route }) => {
  const { result } = route.params;

  const getCommuteIcon = (mode: string) => {
    switch (mode) {
      case 'Walk':
        return '🚶';
      case 'Drive':
        return '🚗';
      case 'Bus':
        return '🚌';
      case 'Train':
        return '🚆';
      default:
        return '🚀';
    }
  };

  const getCommuteColor = (mode: string) => {
    switch (mode) {
      case 'Walk':
        return 'bg-green-100 text-green-800';
      case 'Drive':
        return 'bg-blue-100 text-blue-800';
      case 'Bus':
        return 'bg-purple-100 text-purple-800';
      case 'Train':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6 py-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Your Commute Plan
          </Text>
          <Text className="text-gray-600 text-base">
            Here's when you should leave to arrive on time
          </Text>
        </View>

        {/* Main Result Card */}
        <View className="bg-white rounded-xl p-6 shadow-sm mb-6">
          {/* Commute Mode Badge */}
          <View className="flex-row items-center mb-6">
            <Text className="text-2xl mr-3">{getCommuteIcon(result.commuteMode)}</Text>
            <View className={`px-3 py-1 rounded-full ${getCommuteColor(result.commuteMode)}`}>
              <Text className="font-semibold">{result.commuteMode}</Text>
            </View>
          </View>

          {/* Main Result */}
          <View className="bg-blue-50 rounded-xl p-6 mb-6">
            <Text className="text-center text-gray-600 text-base mb-2">
              To arrive by
            </Text>
            <Text className="text-center text-3xl font-bold text-blue-900 mb-4">
              {formatTime(result.arrivalTime)}
            </Text>
            <Text className="text-center text-gray-600 text-base mb-2">
              leave by
            </Text>
            <Text className="text-center text-3xl font-bold text-green-600">
              {formatTime(result.leaveTime)}
            </Text>
          </View>

          {/* Additional Info */}
          <View className="bg-gray-50 rounded-lg p-4">
            <Text className="text-center text-gray-700 text-base">
              Estimated travel time: <Text className="font-semibold">{result.duration} minutes</Text>
            </Text>
            <Text className="text-center text-gray-500 text-sm mt-1">
              {formatDate(result.arrivalTime)}
            </Text>
          </View>
        </View>

        {/* Tips Section */}
        <View className="bg-yellow-50 rounded-xl p-6 mb-6">
          <Text className="text-lg font-semibold text-yellow-900 mb-3">
            💡 Pro Tips
          </Text>
          <View className="space-y-2">
            <Text className="text-yellow-800 text-base">
              • Add 5-10 minutes buffer for unexpected delays
            </Text>
            <Text className="text-yellow-800 text-base">
              • Check real-time traffic conditions before leaving
            </Text>
            <Text className="text-yellow-800 text-base">
              • Consider weather conditions that may affect travel time
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3">
          <Button
            title="Plan Another Trip"
            size="large"
            onPress={() => navigation.navigate('Planner')}
            style={{ width: '100%' }}
          />
          <Button
            title="Back to Home"
            variant="secondary"
            size="large"
            onPress={() => navigation.navigate('Home')}
            style={{ width: '100%' }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}; 