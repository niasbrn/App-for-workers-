// This is a reusable component for the Tab Bar background
// It handles the Blur effect on iOS and falls back to a View on Android.

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabBarBackground() {
  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        // iOS: Use the native BlurView for that frosted glass look
        <BlurView
          tint="systemChromeMaterial" 
          intensity={100}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        // Android: Just a plain view (the color is handled by layout.tsx)
        <View style={styles.androidBackground} />
      )}
    </View>
  );
}

export function useBottomTabOverflow() {
  const tabHeight = useBottomTabBarHeight();
  const { bottom } = useSafeAreaInsets();
  return tabHeight - bottom;
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    // Match the border radius from your _layout.tsx so the blur doesn't bleed out
    borderRadius: 20, 
  },
  androidBackground: {
    flex: 1,
    // You can set this to match your card color if needed, 
    // but usually _layout.tsx handles the main color.
  },
});