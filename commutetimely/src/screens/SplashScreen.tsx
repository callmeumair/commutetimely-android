import React, { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { COLORS, FONT_SIZES, SPACING } from '../constants';
import { APP_CONFIG } from '../constants';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.primary[500],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background gradient effect */}
      <MotiView
        from={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1000 }}
        style={{
          position: 'absolute',
          width: width * 1.5,
          height: height * 1.5,
          borderRadius: (width * 1.5) / 2,
          backgroundColor: COLORS.primary[400],
          top: -height * 0.25,
          left: -width * 0.25,
        }}
      />

      {/* Main logo container */}
      <MotiView
        from={{ opacity: 0, scale: 0.5, rotate: '-180deg' }}
        animate={{ opacity: 1, scale: 1, rotate: '0deg' }}
        transition={{ 
          type: 'spring', 
          damping: 15, 
          stiffness: 100,
          delay: 200 
        }}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: SPACING.xl,
        }}
      >
        {/* App icon */}
        <MotiView
          from={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: 'spring', 
            damping: 10, 
            stiffness: 200,
            delay: 500 
          }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 30,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: SPACING.lg,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 12,
          }}
        >
          <Text style={{ fontSize: 48 }}>⏰</Text>
        </MotiView>

        {/* App name */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ 
            type: 'spring', 
            damping: 15, 
            stiffness: 100,
            delay: 800 
          }}
        >
          <Text
            style={{
              fontSize: FONT_SIZES['4xl'],
              fontWeight: 'bold',
              color: '#FFFFFF',
              textAlign: 'center',
              marginBottom: SPACING.sm,
            }}
          >
            {APP_CONFIG.name}
          </Text>
        </MotiView>

        {/* Tagline */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ 
            type: 'spring', 
            damping: 15, 
            stiffness: 100,
            delay: 1000 
          }}
        >
          <Text
            style={{
              fontSize: FONT_SIZES.lg,
              color: COLORS.primary[100],
              textAlign: 'center',
              fontWeight: '400',
            }}
          >
            {APP_CONFIG.tagline}
          </Text>
        </MotiView>
      </MotiView>

      {/* Loading indicator */}
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1200 }}
        style={{
          position: 'absolute',
          bottom: height * 0.2,
          alignItems: 'center',
        }}
      >
        <MotiView
          from={{ rotate: '0deg' }}
          animate={{ rotate: '360deg' }}
          transition={{ 
            type: 'timing', 
            duration: 2000, 
            loop: true 
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 3,
            borderColor: '#FFFFFF',
            borderTopColor: 'transparent',
          }}
        />
        <Text
          style={{
            fontSize: FONT_SIZES.sm,
            color: COLORS.primary[100],
            marginTop: SPACING.md,
            fontWeight: '500',
          }}
        >
          Loading...
        </Text>
      </MotiView>

      {/* Floating elements for visual interest */}
      {[...Array(6)].map((_, index) => (
        <MotiView
          key={index}
          from={{ 
            opacity: 0, 
            scale: 0, 
            translateX: Math.random() * 200 - 100,
            translateY: Math.random() * 200 - 100,
          }}
          animate={{ 
            opacity: 0.3, 
            scale: 1,
            translateX: Math.random() * 300 - 150,
            translateY: Math.random() * 300 - 150,
          }}
          transition={{ 
            type: 'spring', 
            damping: 20, 
            stiffness: 50,
            delay: 1500 + index * 200,
            loop: true,
            repeatReverse: true,
          }}
          style={{
            position: 'absolute',
            width: 20 + Math.random() * 30,
            height: 20 + Math.random() * 30,
            borderRadius: 10 + Math.random() * 15,
            backgroundColor: COLORS.primary[300],
            opacity: 0.3,
          }}
        />
      ))}
    </View>
  );
}; 