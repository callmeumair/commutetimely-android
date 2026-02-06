import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { CommuteMode } from '../types';
import { COMMUTE_MODES, COLORS, BORDER_RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../constants';

interface CommuteModeSelectorProps {
  selectedMode: CommuteMode | null;
  onSelectMode: (mode: CommuteMode) => void;
  disabled?: boolean;
}

export const CommuteModeSelector: React.FC<CommuteModeSelectorProps> = ({
  selectedMode,
  onSelectMode,
  disabled = false,
}) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 15, stiffness: 150 }}
    >
      <Text
        style={{
          color: COLORS.secondary[700],
          fontSize: FONT_SIZES.sm,
          fontWeight: '500',
          marginBottom: SPACING.sm,
        }}
      >
        Commute Mode
      </Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: SPACING.sm }}
      >
        {COMMUTE_MODES.map((mode, index) => (
          <MotiView
            key={mode.id}
            from={{ opacity: 0, scale: 0.8, translateX: -20 }}
            animate={{ opacity: 1, scale: 1, translateX: 0 }}
            transition={{ 
              type: 'spring', 
              damping: 15, 
              stiffness: 150,
              delay: index * 100 
            }}
            style={{ marginRight: SPACING.md }}
          >
            <TouchableOpacity
              onPress={() => !disabled && onSelectMode(mode.id)}
              disabled={disabled}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: SPACING.lg,
                paddingVertical: SPACING.md,
                borderRadius: BORDER_RADIUS.xl,
                backgroundColor: selectedMode === mode.id 
                  ? mode.color 
                  : '#FFFFFF',
                borderWidth: 2,
                borderColor: selectedMode === mode.id 
                  ? mode.color 
                  : COLORS.gray[200],
                minWidth: 100,
                minHeight: 80,
                ...SHADOWS.md,
              }}
            >
              <MotiView
                from={{ scale: 0.5, rotate: '-10deg' }}
                animate={{ 
                  scale: selectedMode === mode.id ? 1.2 : 1,
                  rotate: selectedMode === mode.id ? '0deg' : '-10deg'
                }}
                transition={{ type: 'spring', damping: 10, stiffness: 200 }}
              >
                <Text style={{ fontSize: 32, marginBottom: SPACING.xs }}>
                  {mode.icon}
                </Text>
              </MotiView>
              
              <MotiView
                from={{ opacity: 0, translateY: 5 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 200 + index * 50 }}
              >
                <Text
                  style={{
                    fontSize: FONT_SIZES.sm,
                    fontWeight: '600',
                    color: selectedMode === mode.id 
                      ? '#FFFFFF' 
                      : COLORS.secondary[700],
                    textAlign: 'center',
                  }}
                >
                  {mode.label}
                </Text>
              </MotiView>

              {selectedMode === mode.id && (
                <MotiView
                  from={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 150 }}
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: '#FFFFFF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...SHADOWS.sm,
                  }}
                >
                  <Text style={{ fontSize: 12, color: mode.color }}>✓</Text>
                </MotiView>
              )}
            </TouchableOpacity>
          </MotiView>
        ))}
      </ScrollView>
    </MotiView>
  );
}; 