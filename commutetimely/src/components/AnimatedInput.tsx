import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, TextInputProps } from 'react-native';
import { MotiView } from 'moti';
import { COLORS, BORDER_RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../constants';
import { MOCK_LOCATIONS } from '../constants';

interface AnimatedInputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  showAutocomplete?: boolean;
  autocompleteData?: string[];
  onSelectAutocomplete?: (item: string) => void;
  icon?: React.ReactNode;
}

export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  showAutocomplete = false,
  autocompleteData = MOCK_LOCATIONS,
  onSelectAutocomplete,
  icon,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const filteredSuggestions = autocompleteData.filter(item =>
    item.toLowerCase().includes(value.toLowerCase()) && value.length > 0
  );

  const handleFocus = () => {
    setIsFocused(true);
    if (showAutocomplete && value.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for selection
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleTextChange = (text: string) => {
    onChangeText(text);
    if (showAutocomplete) {
      setShowSuggestions(text.length > 0);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    onChangeText(suggestion);
    setShowSuggestions(false);
    onSelectAutocomplete?.(suggestion);
    inputRef.current?.blur();
  };

  return (
    <View style={{ marginBottom: SPACING.md }}>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 150 }}
      >
        {label && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 100 }}
          >
            <Text
              style={{
                color: COLORS.secondary[700],
                fontSize: FONT_SIZES.sm,
                fontWeight: '500',
                marginBottom: SPACING.xs,
              }}
            >
              {label}
            </Text>
          </MotiView>
        )}

        <MotiView
          from={{ scale: 0.95 }}
          animate={{ scale: isFocused ? 1.02 : 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 150 }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderWidth: 2,
              borderColor: error 
                ? COLORS.warning[500] 
                : isFocused 
                  ? COLORS.primary[400] 
                  : COLORS.gray[200],
              borderRadius: BORDER_RADIUS.lg,
              paddingHorizontal: SPACING.md,
              paddingVertical: SPACING.sm,
              ...SHADOWS.sm,
            }}
          >
            {icon && (
              <MotiView
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 150 }}
                style={{ marginRight: SPACING.sm }}
              >
                {icon}
              </MotiView>
            )}

            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={handleTextChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              placeholderTextColor={COLORS.gray[400]}
              style={{
                flex: 1,
                fontSize: FONT_SIZES.md,
                color: COLORS.secondary[800],
                paddingVertical: SPACING.sm,
              }}
              {...props}
            />
          </View>
        </MotiView>

        {error && (
          <MotiView
            from={{ opacity: 0, translateX: -10 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 150 }}
          >
            <Text
              style={{
                color: COLORS.warning[600],
                fontSize: FONT_SIZES.xs,
                marginTop: SPACING.xs,
                marginLeft: SPACING.sm,
              }}
            >
              {error}
            </Text>
          </MotiView>
        )}

        {showAutocomplete && showSuggestions && filteredSuggestions.length > 0 && (
          <MotiView
            from={{ opacity: 0, scale: 0.95, translateY: -10 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 150 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              borderRadius: BORDER_RADIUS.lg,
              borderWidth: 1,
              borderColor: COLORS.gray[200],
              maxHeight: 200,
              zIndex: 1000,
              ...SHADOWS.lg,
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ paddingVertical: SPACING.xs }}
            >
              {filteredSuggestions.map((suggestion, index) => (
                <MotiView
                  key={suggestion}
                  from={{ opacity: 0, translateX: -20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ delay: index * 50 }}
                >
                  <TouchableOpacity
                    onPress={() => handleSelectSuggestion(suggestion)}
                    style={{
                      paddingHorizontal: SPACING.md,
                      paddingVertical: SPACING.sm,
                      borderBottomWidth: index === filteredSuggestions.length - 1 ? 0 : 1,
                      borderBottomColor: COLORS.gray[100],
                    }}
                  >
                    <Text
                      style={{
                        fontSize: FONT_SIZES.md,
                        color: COLORS.secondary[700],
                      }}
                    >
                      {suggestion}
                    </Text>
                  </TouchableOpacity>
                </MotiView>
              ))}
            </ScrollView>
          </MotiView>
        )}
      </MotiView>
    </View>
  );
}; 