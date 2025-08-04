import React from 'react';
import { TextInput, Text, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  style,
  ...props
}) => {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-700 font-medium mb-2 text-base">
          {label}
        </Text>
      )}
      <TextInput
        className={`border border-gray-300 rounded-lg px-4 py-3 text-base bg-white ${
          error ? 'border-red-500' : ''
        }`}
        placeholderTextColor="#9CA3AF"
        style={style}
        {...props}
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
    </View>
  );
}; 