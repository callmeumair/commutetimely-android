import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { CommuteMode } from '../types';

interface DropdownProps {
  label?: string;
  value: CommuteMode | null;
  onValueChange: (value: CommuteMode) => void;
  options: CommuteMode[];
  placeholder?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Select an option',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = (option: CommuteMode) => {
    onValueChange(option);
    setIsVisible(false);
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
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="bg-white rounded-t-3xl p-6 max-h-96">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-900">
                Select Commute Mode
              </Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Text className="text-blue-500 text-lg">Cancel</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-4 border-b border-gray-200"
                  onPress={() => handleSelect(item)}
                >
                  <Text className="text-base text-gray-900">{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}; 