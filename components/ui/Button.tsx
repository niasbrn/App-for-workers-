import { BorderRadius, Colors, FontSizes, FontWeights, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // --- ANIMATION VALUES ---
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // --- INTERACTION HANDLERS ---
  const handlePressIn = () => {
    if (disabled || loading) return;
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.95, 
        useNativeDriver: true,
        speed: 20,
      }),
      Animated.timing(translateY, {
        toValue: 4, 
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1, 
        useNativeDriver: true,
        bounciness: 10,
      }),
      Animated.timing(translateY, {
        toValue: 0, 
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // --- STYLE LOGIC ---
  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.backgroundSecondary;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      case 'danger': return colors.error;
      default: return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textMuted;
    switch (variant) {
      case 'primary':
      case 'danger': return '#FFFFFF';
      case 'secondary': return colors.text;
      case 'outline': return colors.primary;
      case 'ghost': return colors.text;
      default: return '#FFFFFF';
    }
  };

  const getBorderColor = () => {
    if (disabled) return 'transparent';
    if (variant === 'outline') return colors.primary;
    return '#000000'; 
  };

  const getPadding = () => {
    // We use Platform here to fine-tune vertical spacing
    // Android text sometimes sits higher, so we can adjust if needed
    const verticalFix = Platform.OS === 'android' ? 0 : 0; 

    switch (size) {
      case 'sm': 
        return { paddingVertical: Spacing.sm + verticalFix, paddingHorizontal: Spacing.md };
      case 'lg': 
        return { paddingVertical: Spacing.md + verticalFix, paddingHorizontal: Spacing.xl };
      default: 
        return { paddingVertical: Spacing.sm + 4 + verticalFix, paddingHorizontal: Spacing.lg };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm': return FontSizes.sm;
      case 'lg': return FontSizes.lg;
      default: return FontSizes.md;
    }
  };

  const hasShadow = variant !== 'ghost' && !disabled;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        style, 
      ]}
    >
      {/* 1. SHADOW LAYER */}
      {hasShadow && (
        <View style={[
          styles.shadowLayer,
          { borderRadius: BorderRadius.md }
        ]} />
      )}

      {/* 2. FACE LAYER */}
      <Animated.View
        style={[
          styles.buttonFace,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            ...getPadding(),
            transform: [{ scale }, { translateY }],
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} size="small" />
        ) : (
          <>
            {icon && iconPosition === 'left' && <View style={{ marginRight: Spacing.sm }}>{icon}</View>}
            
            <Text
              style={[
                styles.text,
                {
                  color: getTextColor(),
                  fontSize: getFontSize(),
                },
                textStyle,
              ]}
            >
              {title}
            </Text>

            {icon && iconPosition === 'right' && <View style={{ marginLeft: Spacing.sm }}>{icon}</View>}
          </>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: 4, 
  },
  fullWidth: {
    width: '100%',
  },
  shadowLayer: {
    position: 'absolute',
    top: 4, 
    left: 0,
    right: 0,
    bottom: -4, 
    backgroundColor: '#000000', 
    width: '100%',
    height: '100%',
  },
  buttonFace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 2, 
  },
  text: {
    fontWeight: FontWeights.bold, 
    textAlign: 'center',
  },
});