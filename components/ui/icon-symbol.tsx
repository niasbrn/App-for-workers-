// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  
  // Tasks & Work
  'checklist': 'assignment',
  'list.bullet': 'format-list-bulleted',
  'checkmark.circle.fill': 'check-circle',
  'clock.fill': 'schedule',
  'calendar': 'calendar-today',
  
  // Camera & Photos
  'camera.fill': 'camera-alt',
  'photo.fill': 'photo',
  'photo.stack': 'photo-library',
  
  // Location & Map
  'map.fill': 'map',
  'location.fill': 'location-on',
  'pin.fill': 'push-pin',
  
  // AI & Analysis
  'sparkles': 'auto-awesome',
  'brain': 'psychology',
  'wand.and.stars': 'auto-fix-high',
  
  // General
  'person.fill': 'person',
  'bell.fill': 'notifications',
  'gear': 'settings',
  'plus': 'add',
  'xmark': 'close',
  'arrow.up.circle.fill': 'file-upload',
  'exclamationmark.triangle.fill': 'warning',
  'info.circle.fill': 'info',
  'checkmark': 'check',
  'arrow.right': 'arrow-forward',
  'magnifyingglass': 'search',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}

export type { IconSymbolName };
