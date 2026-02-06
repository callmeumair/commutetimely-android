import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { AnimatedButton } from '../components/AnimatedButton';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import { APP_CONFIG } from '../constants';

const { width, height } = Dimensions.get('window');

interface LandingScreenProps {
  onGetStarted: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: '🚶',
      title: 'Smart Planning',
      description: 'Plan your commute with precision using real-time estimates',
    },
    {
      icon: '⏰',
      title: 'Perfect Timing',
      description: 'Arrive exactly when you need to, every time',
    },
    {
      icon: '🎯',
      title: 'Multiple Modes',
      description: 'Walk, drive, bus, or train - we\'ve got you covered',
    },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.gray[50] }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ padding: SPACING.xl }}>
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100 }}
          style={{ alignItems: 'center', marginBottom: SPACING.xxl }}
        >
          <MotiView
            from={{ scale: 0.8, rotate: '-10deg' }}
            animate={{ scale: 1, rotate: '0deg' }}
            transition={{ 
              type: 'spring', 
              damping: 10, 
              stiffness: 200,
              delay: 300 
            }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 25,
              backgroundColor: COLORS.primary[500],
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: SPACING.lg,
              ...SHADOWS.lg,
            }}
          >
            <Text style={{ fontSize: 40 }}>⏰</Text>
          </MotiView>

          <Text
            style={{
              fontSize: FONT_SIZES['3xl'],
              fontWeight: 'bold',
              color: COLORS.secondary[800],
              textAlign: 'center',
              marginBottom: SPACING.sm,
            }}
          >
            Welcome to {APP_CONFIG.name}
          </Text>

          <Text
            style={{
              fontSize: FONT_SIZES.lg,
              color: COLORS.secondary[600],
              textAlign: 'center',
              lineHeight: 24,
            }}
          >
            {APP_CONFIG.description}
          </Text>
        </MotiView>

        {/* Features */}
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 500 }}
          style={{ marginBottom: SPACING.xxl }}
        >
          <Text
            style={{
              fontSize: FONT_SIZES.xl,
              fontWeight: '600',
              color: COLORS.secondary[800],
              textAlign: 'center',
              marginBottom: SPACING.xl,
            }}
          >
            Why Choose {APP_CONFIG.name}?
          </Text>

          {features.map((feature, index) => (
            <MotiView
              key={feature.title}
              from={{ opacity: 0, translateX: -50 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ 
                type: 'spring', 
                damping: 15, 
                stiffness: 100,
                delay: 700 + index * 200 
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                padding: SPACING.lg,
                borderRadius: BORDER_RADIUS.xl,
                marginBottom: SPACING.md,
                ...SHADOWS.md,
              }}
            >
              <MotiView
                from={{ scale: 0, rotate: '-180deg' }}
                animate={{ scale: 1, rotate: '0deg' }}
                transition={{ 
                  type: 'spring', 
                  damping: 10, 
                  stiffness: 200,
                  delay: 900 + index * 200 
                }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 15,
                  backgroundColor: COLORS.primary[100],
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: SPACING.lg,
                }}
              >
                <Text style={{ fontSize: 24 }}>{feature.icon}</Text>
              </MotiView>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: FONT_SIZES.lg,
                    fontWeight: '600',
                    color: COLORS.secondary[800],
                    marginBottom: SPACING.xs,
                  }}
                >
                  {feature.title}
                </Text>
                <Text
                  style={{
                    fontSize: FONT_SIZES.md,
                    color: COLORS.secondary[600],
                    lineHeight: 20,
                  }}
                >
                  {feature.description}
                </Text>
              </View>
            </MotiView>
          ))}
        </MotiView>

        {/* Stats */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 1300 }}
          style={{
            backgroundColor: COLORS.primary[500],
            borderRadius: BORDER_RADIUS.xl,
            padding: SPACING.xl,
            marginBottom: SPACING.xxl,
            ...SHADOWS.lg,
          }}
        >
          <Text
            style={{
              fontSize: FONT_SIZES.xl,
              fontWeight: '600',
              color: '#FFFFFF',
              textAlign: 'center',
              marginBottom: SPACING.lg,
            }}
          >
            Trusted by Commuters Worldwide
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            {[
              { number: '10K+', label: 'Users' },
              { number: '50K+', label: 'Trips Planned' },
              { number: '99%', label: 'Accuracy' },
            ].map((stat, index) => (
              <MotiView
                key={stat.label}
                from={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  type: 'spring', 
                  damping: 15, 
                  stiffness: 100,
                  delay: 1500 + index * 100 
                }}
                style={{ alignItems: 'center' }}
              >
                <Text
                  style={{
                    fontSize: FONT_SIZES['2xl'],
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                    marginBottom: SPACING.xs,
                  }}
                >
                  {stat.number}
                </Text>
                <Text
                  style={{
                    fontSize: FONT_SIZES.sm,
                    color: COLORS.primary[100],
                    fontWeight: '500',
                  }}
                >
                  {stat.label}
                </Text>
              </MotiView>
            ))}
          </View>
        </MotiView>

        {/* Get Started Button */}
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 1700 }}
        >
          <AnimatedButton
            title="Get Started"
            onPress={onGetStarted}
            size="lg"
            style={{ marginBottom: SPACING.xl }}
          />
        </MotiView>

        {/* Footer */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1900 }}
          style={{ alignItems: 'center' }}
        >
          <Text
            style={{
              fontSize: FONT_SIZES.sm,
              color: COLORS.secondary[500],
              textAlign: 'center',
            }}
          >
            Start planning your perfect commute today
          </Text>
        </MotiView>
      </View>
    </ScrollView>
  );
}; 