import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { MotiView } from 'moti';
import { COLORS, BORDER_RADIUS, SPACING, FONT_SIZES } from '../constants';

interface AnimatedButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onPress?: () => void;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  onPress,
  style,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: disabled ? COLORS.gray[300] : COLORS.primary[500],
          text: '#FFFFFF',
          border: 'transparent',
        };
      case 'secondary':
        return {
          bg: disabled ? COLORS.gray[200] : COLORS.secondary[100],
          text: disabled ? COLORS.gray[500] : COLORS.secondary[700],
          border: 'transparent',
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: disabled ? COLORS.gray[400] : COLORS.primary[600],
          border: disabled ? COLORS.gray[300] : COLORS.primary[300],
        };
      case 'ghost':
        return {
          bg: 'transparent',
          text: disabled ? COLORS.gray[400] : COLORS.secondary[600],
          border: 'transparent',
        };
      default:
        return {
          bg: COLORS.primary[500],
          text: '#FFFFFF',
          border: 'transparent',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.sm,
          fontSize: FONT_SIZES.sm,
          borderRadius: BORDER_RADIUS.md,
        };
      case 'lg':
        return {
          paddingHorizontal: SPACING.xl,
          paddingVertical: SPACING.lg,
          fontSize: FONT_SIZES.lg,
          borderRadius: BORDER_RADIUS.lg,
        };
      default:
        return {
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.md,
          fontSize: FONT_SIZES.md,
          borderRadius: BORDER_RADIUS.md,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 15, stiffness: 150 }}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          {
            backgroundColor: variantStyles.bg,
            borderWidth: variant === 'outline' ? 1 : 0,
            borderColor: variantStyles.border,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            paddingVertical: sizeStyles.paddingVertical,
            borderRadius: sizeStyles.borderRadius,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            minHeight: size === 'lg' ? 56 : size === 'sm' ? 36 : 44,
          },
          style,
        ]}
        {...props}
      >
        <MotiView
          from={{ opacity: 0, translateX: -10 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ delay: 100 }}
          style={{ marginRight: icon ? SPACING.sm : 0 }}
        >
          {icon}
        </MotiView>
        
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: loading ? 0.7 : 1 }}
          transition={{ delay: 200 }}
        >
          <Text
            style={{
              color: variantStyles.text,
              fontSize: sizeStyles.fontSize,
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            {loading ? 'Calculating...' : title}
          </Text>
        </MotiView>

        {loading && (
          <MotiView
            from={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 150 }}
            style={{ marginLeft: SPACING.sm }}
          >
            <MotiView
              from={{ rotate: '0deg' }}
              animate={{ rotate: '360deg' }}
              transition={{ type: 'timing', duration: 1000, loop: true }}
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: variantStyles.text,
                borderTopColor: 'transparent',
              }}
            />
          </MotiView>
        )}
      </TouchableOpacity>
    </MotiView>
  );
}; 