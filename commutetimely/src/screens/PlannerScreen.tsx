import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { MotiView } from 'moti';
import { AnimatedButton } from '../components/AnimatedButton';
import { AnimatedInput } from '../components/AnimatedInput';
import { CommuteModeSelector } from '../components/CommuteModeSelector';
import { AnimatedTimePicker } from '../components/AnimatedTimePicker';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import { CommuteMode, Location, LeaveTimeResult } from '../types';
import { estimateLeaveTime, validateFormData } from '../utils/estimateLeaveTime';

interface PlannerScreenProps {
  onCalculate: (result: LeaveTimeResult) => void;
}

export const PlannerScreen: React.FC<PlannerScreenProps> = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    commuteMode: null as CommuteMode | null,
    startLocation: null as Location | null,
    destinationLocation: null as Location | null,
    arrivalTime: null as Date | null,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleModeSelect = (mode: CommuteMode) => {
    setFormData(prev => ({ ...prev, commuteMode: mode }));
    setErrors([]);
  };

  const handleStartLocationChange = (text: string) => {
    setFormData(prev => ({
      ...prev,
      startLocation: { id: 'start', name: text }
    }));
    setErrors([]);
  };

  const handleDestinationChange = (text: string) => {
    setFormData(prev => ({
      ...prev,
      destinationLocation: { id: 'destination', name: text }
    }));
    setErrors([]);
  };

  const handleArrivalTimeChange = (date: Date) => {
    setFormData(prev => ({ ...prev, arrivalTime: date }));
    setErrors([]);
  };

  const handleCalculate = async () => {
    const validation = validateFormData(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = estimateLeaveTime(
        formData.arrivalTime!,
        formData.commuteMode!,
        formData.startLocation!,
        formData.destinationLocation!
      );

      onCalculate(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to calculate commute time. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.commuteMode && 
    formData.startLocation?.name && 
    formData.destinationLocation?.name && 
    formData.arrivalTime;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.gray[50] }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ padding: SPACING.xl }}>
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100 }}
          style={{ marginBottom: SPACING.xl }}
        >
          <Text
            style={{
              fontSize: FONT_SIZES['3xl'],
              fontWeight: 'bold',
              color: COLORS.secondary[800],
              textAlign: 'center',
              marginBottom: SPACING.sm,
            }}
          >
            Plan Your Commute
          </Text>
          <Text
            style={{
              fontSize: FONT_SIZES.lg,
              color: COLORS.secondary[600],
              textAlign: 'center',
              lineHeight: 24,
            }}
          >
            Tell us how you want to travel and when you need to arrive
          </Text>
        </MotiView>

        {/* Commute Mode Selector */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 200 }}
          style={{ marginBottom: SPACING.xl }}
        >
          <CommuteModeSelector
            selectedMode={formData.commuteMode}
            onSelectMode={handleModeSelect}
            disabled={isLoading}
          />
        </MotiView>

        {/* Location Inputs */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 400 }}
          style={{ marginBottom: SPACING.xl }}
        >
          <AnimatedInput
            label="Start Location"
            placeholder="Where are you starting from?"
            value={formData.startLocation?.name || ''}
            onChangeText={handleStartLocationChange}
            showAutocomplete={true}
            disabled={isLoading}
            icon={<Text style={{ fontSize: 20 }}>📍</Text>}
          />

          <AnimatedInput
            label="Destination"
            placeholder="Where are you going?"
            value={formData.destinationLocation?.name || ''}
            onChangeText={handleDestinationChange}
            showAutocomplete={true}
            disabled={isLoading}
            icon={<Text style={{ fontSize: 20 }}>🎯</Text>}
          />
        </MotiView>

        {/* Arrival Time Picker */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 600 }}
          style={{ marginBottom: SPACING.xl }}
        >
          <AnimatedTimePicker
            label="Arrival Time"
            value={formData.arrivalTime}
            onValueChange={handleArrivalTimeChange}
            disabled={isLoading}
          />
        </MotiView>

        {/* Error Messages */}
        {errors.length > 0 && (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 100 }}
            style={{
              backgroundColor: COLORS.warning[50],
              borderWidth: 1,
              borderColor: COLORS.warning[200],
              borderRadius: BORDER_RADIUS.lg,
              padding: SPACING.md,
              marginBottom: SPACING.lg,
            }}
          >
            {errors.map((error, index) => (
              <Text
                key={index}
                style={{
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.warning[700],
                  marginBottom: index < errors.length - 1 ? SPACING.xs : 0,
                }}
              >
                • {error}
              </Text>
            ))}
          </MotiView>
        )}

        {/* Calculate Button */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 800 }}
        >
          <AnimatedButton
            title="Calculate Leave Time"
            onPress={handleCalculate}
            loading={isLoading}
            disabled={!isFormValid || isLoading}
            size="lg"
            style={{ marginBottom: SPACING.lg }}
          />
        </MotiView>

        {/* Tips Section */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 1000 }}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING.lg,
            ...SHADOWS.md,
          }}
        >
          <Text
            style={{
              fontSize: FONT_SIZES.lg,
              fontWeight: '600',
              color: COLORS.secondary[800],
              marginBottom: SPACING.md,
            }}
          >
            💡 Pro Tips
          </Text>
          
          <View style={{ gap: SPACING.sm }}>
            <Text
              style={{
                fontSize: FONT_SIZES.sm,
                color: COLORS.secondary[600],
                lineHeight: 20,
              }}
            >
              • Add 5-10 minutes buffer for unexpected delays
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZES.sm,
                color: COLORS.secondary[600],
                lineHeight: 20,
              }}
            >
              • Rush hour times (7-9 AM, 5-7 PM) may take longer
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZES.sm,
                color: COLORS.secondary[600],
                lineHeight: 20,
              }}
            >
              • Check weather conditions for walking/cycling
            </Text>
          </View>
        </MotiView>
      </View>
    </ScrollView>
  );
}; 