import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { AnimatedButton } from '../components/AnimatedButton';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import { LeaveTimeResult } from '../types';
import { formatTime, formatDate, formatDuration, getCommuteModeInfo } from '../utils/estimateLeaveTime';

const { width, height } = Dimensions.get('window');

interface ResultScreenProps {
  result: LeaveTimeResult;
  onPlanAnother: () => void;
  onBackToHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  onPlanAnother,
  onBackToHome,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const modeInfo = getCommuteModeInfo(result.commuteMode);

  useEffect(() => {
    // Trigger confetti animation after a short delay
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const ConfettiPiece = ({ delay, color, size, startX }: {
    delay: number;
    color: string;
    size: number;
    startX: number;
  }) => (
    <MotiView
      from={{
        opacity: 0,
        scale: 0,
        translateX: startX,
        translateY: -50,
        rotate: '0deg',
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0],
        translateX: startX + (Math.random() - 0.5) * 100,
        translateY: height + 100,
        rotate: '360deg',
      }}
      transition={{
        type: 'timing',
        duration: 3000,
        delay,
        loop: false,
      }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: size / 2,
        top: -50,
        left: startX,
      }}
    />
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.gray[50] }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ padding: SPACING.xl }}>
        {/* Confetti Animation */}
        {showConfetti && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: height, zIndex: 1 }}>
            {[...Array(20)].map((_, index) => (
              <ConfettiPiece
                key={index}
                delay={index * 100}
                color={[COLORS.primary[400], COLORS.success[400], COLORS.warning[400], COLORS.secondary[400]][index % 4]}
                size={8 + Math.random() * 12}
                startX={Math.random() * width}
              />
            ))}
          </View>
        )}

        {/* Success Header */}
        <MotiView
          from={{ opacity: 0, scale: 0.5, rotate: '-180deg' }}
          animate={{ opacity: 1, scale: 1, rotate: '0deg' }}
          transition={{ type: 'spring', damping: 15, stiffness: 100 }}
          style={{ alignItems: 'center', marginBottom: SPACING.xl }}
        >
          <MotiView
            from={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 300 }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: COLORS.success[500],
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: SPACING.lg,
              ...SHADOWS.lg,
            }}
          >
            <Text style={{ fontSize: 48 }}>✅</Text>
          </MotiView>

          <Text
            style={{
              fontSize: FONT_SIZES['3xl'],
              fontWeight: 'bold',
              color: COLORS.success[700],
              textAlign: 'center',
              marginBottom: SPACING.sm,
            }}
          >
            Perfect Timing!
          </Text>
          <Text
            style={{
              fontSize: FONT_SIZES.lg,
              color: COLORS.secondary[600],
              textAlign: 'center',
            }}
          >
            Your commute is all planned out
          </Text>
        </MotiView>

        {/* Main Result Card */}
        <MotiView
          from={{ opacity: 0, translateY: 50, scale: 0.9 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 500 }}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING.xl,
            marginBottom: SPACING.xl,
            ...SHADOWS.lg,
          }}
        >
          {/* Commute Mode */}
          <MotiView
            from={{ opacity: 0, translateX: -30 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 700 }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: SPACING.lg,
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 15,
                backgroundColor: modeInfo?.color + '20',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: SPACING.md,
              }}
            >
              <Text style={{ fontSize: 28 }}>{modeInfo?.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: FONT_SIZES.lg,
                  fontWeight: '600',
                  color: COLORS.secondary[800],
                  marginBottom: SPACING.xs,
                }}
              >
                {modeInfo?.label}
              </Text>
              <Text
                style={{
                  fontSize: FONT_SIZES.md,
                  color: COLORS.secondary[600],
                }}
              >
                {formatDuration(result.duration)} commute
              </Text>
            </View>
          </MotiView>

          {/* Route Info */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 800 }}
            style={{ marginBottom: SPACING.lg }}
          >
            <View style={{ marginBottom: SPACING.md }}>
              <Text
                style={{
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.secondary[500],
                  marginBottom: SPACING.xs,
                }}
              >
                FROM
              </Text>
              <Text
                style={{
                  fontSize: FONT_SIZES.lg,
                  fontWeight: '600',
                  color: COLORS.secondary[800],
                }}
              >
                {result.startLocation.name}
              </Text>
            </View>

            <View style={{ marginBottom: SPACING.md }}>
              <Text
                style={{
                  fontSize: FONT_SIZES.sm,
                  color: COLORS.secondary[500],
                  marginBottom: SPACING.xs,
                }}
              >
                TO
              </Text>
              <Text
                style={{
                  fontSize: FONT_SIZES.lg,
                  fontWeight: '600',
                  color: COLORS.secondary[800],
                }}
              >
                {result.destinationLocation.name}
              </Text>
            </View>
          </MotiView>

          {/* Time Information */}
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 900 }}
            style={{
              backgroundColor: COLORS.primary[50],
              borderRadius: BORDER_RADIUS.lg,
              padding: SPACING.lg,
              marginBottom: SPACING.lg,
            }}
          >
            <Text
              style={{
                fontSize: FONT_SIZES.sm,
                color: COLORS.primary[600],
                fontWeight: '600',
                marginBottom: SPACING.md,
                textAlign: 'center',
              }}
            >
              TIMING SUMMARY
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md }}>
              <View>
                <Text
                  style={{
                    fontSize: FONT_SIZES.sm,
                    color: COLORS.secondary[500],
                    marginBottom: SPACING.xs,
                  }}
                >
                  Arrive by
                </Text>
                <Text
                  style={{
                    fontSize: FONT_SIZES.xl,
                    fontWeight: 'bold',
                    color: COLORS.secondary[800],
                  }}
                >
                  {formatTime(result.arrivalTime)}
                </Text>
                <Text
                  style={{
                    fontSize: FONT_SIZES.sm,
                    color: COLORS.secondary[500],
                  }}
                >
                  {formatDate(result.arrivalTime)}
                </Text>
              </View>

              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 24, color: COLORS.primary[400] }}>→</Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={{
                    fontSize: FONT_SIZES.sm,
                    color: COLORS.secondary[500],
                    marginBottom: SPACING.xs,
                  }}
                >
                  Leave by
                </Text>
                <Text
                  style={{
                    fontSize: FONT_SIZES.xl,
                    fontWeight: 'bold',
                    color: COLORS.primary[600],
                  }}
                >
                  {formatTime(result.leaveTime)}
                </Text>
                <Text
                  style={{
                    fontSize: FONT_SIZES.sm,
                    color: COLORS.secondary[500],
                  }}
                >
                  {formatDate(result.leaveTime)}
                </Text>
              </View>
            </View>
          </MotiView>

          {/* Set Reminder Button */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 1000 }}
          >
            <AnimatedButton
              title="Set Reminder"
              variant="outline"
              onPress={() => {
                // TODO: Implement notification reminder
                console.log('Set reminder for:', result.leaveTime);
              }}
              icon={<Text style={{ fontSize: 16 }}>🔔</Text>}
            />
          </MotiView>
        </MotiView>

        {/* Tips Card */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 1100 }}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING.lg,
            marginBottom: SPACING.xl,
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
            🎯 Pro Tips
          </Text>
          
          <View style={{ gap: SPACING.sm }}>
            <Text
              style={{
                fontSize: FONT_SIZES.sm,
                color: COLORS.secondary[600],
                lineHeight: 20,
              }}
            >
              • Set your alarm 5 minutes before the leave time
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZES.sm,
                color: COLORS.secondary[600],
                lineHeight: 20,
              }}
            >
              • Check traffic conditions before leaving
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZES.sm,
                color: COLORS.secondary[600],
                lineHeight: 20,
              }}
            >
              • Have a backup route ready
            </Text>
          </View>
        </MotiView>

        {/* Action Buttons */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 1200 }}
          style={{ gap: SPACING.md }}
        >
          <AnimatedButton
            title="Plan Another Trip"
            onPress={onPlanAnother}
            size="lg"
          />
          
          <AnimatedButton
            title="Back to Home"
            variant="ghost"
            onPress={onBackToHome}
          />
        </MotiView>
      </View>
    </ScrollView>
  );
}; 