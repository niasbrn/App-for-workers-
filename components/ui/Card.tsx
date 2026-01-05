import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  style,
  onPress,
  variant = 'default',
  padding = 'md',
}: CardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // 1. Calculate Dynamic Styles (Padding & Colors)
  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 'sm': return Spacing.sm;
      case 'lg': return Spacing.lg;
      default: return Spacing.md;
    }
  };

  const dynamicCardStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderColor: colors.border, // Uses the black border from your theme
    padding: getPadding(),
  };

  // 2. Select the correct variant from our StyleSheet
  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return styles.elevated;
      case 'outlined':
        return styles.outlined;
      default:
        return styles.default;
    }
  };

  // 3. Combine Static Styles + Dynamic Styles + User Overrides
  const finalStyle = [
    styles.base,           // The core game look (rounded corners)
    dynamicCardStyle,      // The colors & padding
    getVariantStyle(),     // The shadow or border thickness
    style                  // Any custom style passed as a prop
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={finalStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={finalStyle}>{children}</View>;
}

// 4. Define the Static Game Styles here
const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg, // Uses your new 30px radius
    borderWidth: 2,                // All cards get a thick outline
  },
  default: {
    // Standard cards (flat but with border)
    borderWidth: 2,
  },
  elevated: {
    // THE GAME SHADOW (Neo-Brutalism)
    borderWidth: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,  // Solid shadow
    shadowRadius: 0,   // No blur = Cartoon/Game look
    elevation: 6,      // Android shadow
  },
  outlined: {
    borderWidth: 3,    // Extra thick border for emphasis
    backgroundColor: 'transparent',
  },
});