import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';

interface TimePickerProps {
  label?: string;
  value: Date | null;
  onValueChange: (date: Date) => void;
  placeholder?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  label,
  value,
  onValueChange,
  placeholder = 'Select time',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isAM, setIsAM] = useState(true);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleConfirm = () => {
    let hour = selectedHour;
    if (!isAM && hour !== 12) hour += 12;
    if (isAM && hour === 12) hour = 0;

    const date = new Date();
    date.setHours(hour, selectedMinute, 0, 0);
    onValueChange(date);
    setIsVisible(false);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-700 font-medium mb-2 text-base">
          {label}
        </Text>
      )}
      <TouchableOpacity
        className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
        onPress={() => setIsVisible(true)}
      >
        <Text className={`text-base ${value ? 'text-gray-900' : 'text-gray-500'}`}>
          {value ? formatTime(value) : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-lg font-semibold text-gray-900">
                Select Time
              </Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Text className="text-blue-500 text-lg">Cancel</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center mb-6">
              {/* Hours */}
              <ScrollView className="flex-1 mx-2" showsVerticalScrollIndicator={false}>
                {hours.map((hour) => (
                  <TouchableOpacity
                    key={hour}
                    className={`py-3 items-center rounded-lg mb-1 ${
                      selectedHour === hour ? 'bg-blue-100' : ''
                    }`}
                    onPress={() => setSelectedHour(hour)}
                  >
                    <Text className={`text-lg ${
                      selectedHour === hour ? 'text-blue-600 font-semibold' : 'text-gray-700'
                    }`}>
                      {hour.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text className="text-2xl font-bold text-gray-400 mx-2">:</Text>

              {/* Minutes */}
              <ScrollView className="flex-1 mx-2" showsVerticalScrollIndicator={false}>
                {minutes.map((minute) => (
                  <TouchableOpacity
                    key={minute}
                    className={`py-3 items-center rounded-lg mb-1 ${
                      selectedMinute === minute ? 'bg-blue-100' : ''
                    }`}
                    onPress={() => setSelectedMinute(minute)}
                  >
                    <Text className={`text-lg ${
                      selectedMinute === minute ? 'text-blue-600 font-semibold' : 'text-gray-700'
                    }`}>
                      {minute.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* AM/PM Toggle */}
            <View className="flex-row justify-center mb-6">
              <TouchableOpacity
                className={`px-6 py-3 rounded-lg mr-2 ${
                  isAM ? 'bg-blue-500' : 'bg-gray-200'
                }`}
                onPress={() => setIsAM(true)}
              >
                <Text className={`font-semibold ${
                  isAM ? 'text-white' : 'text-gray-700'
                }`}>
                  AM
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`px-6 py-3 rounded-lg ${
                  !isAM ? 'bg-blue-500' : 'bg-gray-200'
                }`}
                onPress={() => setIsAM(false)}
              >
                <Text className={`font-semibold ${
                  !isAM ? 'text-white' : 'text-gray-700'
                }`}>
                  PM
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="bg-blue-500 py-3 rounded-lg"
              onPress={handleConfirm}
            >
              <Text className="text-white text-center font-semibold text-lg">
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}; 