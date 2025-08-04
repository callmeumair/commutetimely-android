import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Button } from '../components/Button';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-white">
      <View className="flex-1 justify-center items-center px-6">
        {/* App Logo/Icon Placeholder */}
        <View className="w-24 h-24 bg-blue-500 rounded-full items-center justify-center mb-8">
          <Text className="text-white text-3xl font-bold">CT</Text>
        </View>

        {/* App Title */}
        <Text className="text-4xl font-bold text-gray-900 mb-4 text-center">
          CommuteTimely
        </Text>

        {/* App Description */}
        <Text className="text-lg text-gray-600 text-center mb-12 leading-6">
          Plan your commute with precision.{'\n'}
          Arrive on time, every time.
        </Text>

        {/* Get Started Button */}
        <Button
          title="Get Started"
          size="large"
          onPress={() => navigation.navigate('Planner')}
          style={{ width: '100%' }}
        />

        {/* Additional Info */}
        <View className="mt-12 items-center">
          <Text className="text-sm text-gray-500 text-center">
            Calculate the perfect time to leave{'\n'}
            for your destination
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}; 