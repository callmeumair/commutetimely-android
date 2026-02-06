import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { COLORS, BORDER_RADIUS, SPACING, FONT_SIZES, SHADOWS } from '../constants';

interface AnimatedTimePickerProps {
  value: Date | null;
  onValueChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const AnimatedTimePicker: React.FC<AnimatedTimePickerProps> = ({
  value,
  onValueChange,
  label,
  placeholder = 'Select time',
  disabled = false,
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

  const formatDisplayTime = (hour: number, minute: number, isAM: boolean): string => {
    return `${hour}:${minute.toString().padStart(2, '0')} ${isAM ? 'AM' : 'PM'}`;
  };

  return (
    <View style={{ marginBottom: SPACING.md }}>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 150 }}
      >
        {label && (
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
        )}

        <TouchableOpacity
          onPress={() => !disabled && setIsVisible(true)}
          disabled={disabled}
          style={{
            backgroundColor: '#FFFFFF',
            borderWidth: 2,
            borderColor: COLORS.gray[200],
            borderRadius: BORDER_RADIUS.lg,
            paddingHorizontal: SPACING.md,
            paddingVertical: SPACING.md,
            ...SHADOWS.sm,
          }}
        >
          <Text
            style={{
              fontSize: FONT_SIZES.md,
              color: value ? COLORS.secondary[800] : COLORS.gray[400],
              fontWeight: value ? '500' : '400',
            }}
          >
            {value ? formatTime(value) : placeholder}
          </Text>
        </TouchableOpacity>

        <Modal
          visible={isVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsVisible(false)}
        >
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 200 }}
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'flex-end',
            }}
          >
            <MotiView
              from={{ translateY: 300, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              style={{
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: BORDER_RADIUS.xxl,
                borderTopRightRadius: BORDER_RADIUS.xxl,
                padding: SPACING.xl,
                maxHeight: '80%',
              }}
            >
              <View style={{ alignItems: 'center', marginBottom: SPACING.lg }}>
                <View
                  style={{
                    width: 40,
                    height: 4,
                    backgroundColor: COLORS.gray[300],
                    borderRadius: 2,
                    marginBottom: SPACING.lg,
                  }}
                />
                <Text
                  style={{
                    fontSize: FONT_SIZES.xl,
                    fontWeight: '600',
                    color: COLORS.secondary[800],
                  }}
                >
                  Select Time
                </Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: SPACING.xl }}>
                <ScrollView
                  style={{ flex: 1, marginRight: SPACING.md }}
                  showsVerticalScrollIndicator={false}
                >
                  {hours.map((hour) => (
                    <MotiView
                      key={hour}
                      from={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: hour * 20 }}
                    >
                      <TouchableOpacity
                        onPress={() => setSelectedHour(hour)}
                        style={{
                          paddingVertical: SPACING.md,
                          alignItems: 'center',
                          borderRadius: BORDER_RADIUS.md,
                          backgroundColor: selectedHour === hour ? COLORS.primary[100] : 'transparent',
                          marginBottom: SPACING.xs,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: FONT_SIZES.lg,
                            fontWeight: selectedHour === hour ? '600' : '400',
                            color: selectedHour === hour ? COLORS.primary[600] : COLORS.secondary[600],
                          }}
                        >
                          {hour.toString().padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    </MotiView>
                  ))}
                </ScrollView>

                <Text
                  style={{
                    fontSize: FONT_SIZES['2xl'],
                    fontWeight: 'bold',
                    color: COLORS.gray[400],
                    marginHorizontal: SPACING.md,
                  }}
                >
                  :
                </Text>

                <ScrollView
                  style={{ flex: 1, marginLeft: SPACING.md }}
                  showsVerticalScrollIndicator={false}
                >
                  {minutes.map((minute) => (
                    <MotiView
                      key={minute}
                      from={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: minute * 10 }}
                    >
                      <TouchableOpacity
                        onPress={() => setSelectedMinute(minute)}
                        style={{
                          paddingVertical: SPACING.md,
                          alignItems: 'center',
                          borderRadius: BORDER_RADIUS.md,
                          backgroundColor: selectedMinute === minute ? COLORS.primary[100] : 'transparent',
                          marginBottom: SPACING.xs,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: FONT_SIZES.lg,
                            fontWeight: selectedMinute === minute ? '600' : '400',
                            color: selectedMinute === minute ? COLORS.primary[600] : COLORS.secondary[600],
                          }}
                        >
                          {minute.toString().padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    </MotiView>
                  ))}
                </ScrollView>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: SPACING.xl }}>
                <TouchableOpacity
                  onPress={() => setIsAM(true)}
                  style={{
                    paddingHorizontal: SPACING.lg,
                    paddingVertical: SPACING.md,
                    borderRadius: BORDER_RADIUS.lg,
                    backgroundColor: isAM ? COLORS.primary[500] : COLORS.gray[200],
                    marginRight: SPACING.md,
                  }}
                >
                  <Text
                    style={{
                      fontSize: FONT_SIZES.md,
                      fontWeight: '600',
                      color: isAM ? '#FFFFFF' : COLORS.secondary[600],
                    }}
                  >
                    AM
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setIsAM(false)}
                  style={{
                    paddingHorizontal: SPACING.lg,
                    paddingVertical: SPACING.md,
                    borderRadius: BORDER_RADIUS.lg,
                    backgroundColor: !isAM ? COLORS.primary[500] : COLORS.gray[200],
                  }}
                >
                  <Text
                    style={{
                      fontSize: FONT_SIZES.md,
                      fontWeight: '600',
                      color: !isAM ? '#FFFFFF' : COLORS.secondary[600],
                    }}
                  >
                    PM
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'row', gap: SPACING.md }}>
                <TouchableOpacity
                  onPress={() => setIsVisible(false)}
                  style={{
                    flex: 1,
                    paddingVertical: SPACING.md,
                    borderRadius: BORDER_RADIUS.lg,
                    backgroundColor: COLORS.gray[200],
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: FONT_SIZES.md,
                      fontWeight: '600',
                      color: COLORS.secondary[600],
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleConfirm}
                  style={{
                    flex: 1,
                    paddingVertical: SPACING.md,
                    borderRadius: BORDER_RADIUS.lg,
                    backgroundColor: COLORS.primary[500],
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: FONT_SIZES.md,
                      fontWeight: '600',
                      color: '#FFFFFF',
                    }}
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </MotiView>
          </MotiView>
        </Modal>
      </MotiView>
    </View>
  );
}; 