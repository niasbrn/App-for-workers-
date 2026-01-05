/**
 * WorkerTrack Theme - Gamified, Vibrant, "Neo-Brutalist" Design
 */

import { Platform } from 'react-native';

// --- GAME PALETTE DEFINITIONS ---
// We use high-saturation "Candy" colors instead of standard corporate tones.

// Action Colors
const gamePink = '#FF2E93';    // Main Action / "Play" Button
const gameCyan = '#00F0FF';    // Secondary / Mana / Info
const gameYellow = '#FFD300';  // Gold / Currency / Warning
const gameGreen = '#39FF14';   // Success / XP Gained
const gameRed = '#FF003C';     // Error / "Game Over"

// Backgrounds (Light Mode)
const lightBg = '#FDFCF0';     // Creamy White (easier on eyes than pure white)
const lightCard = '#FFFFFF';

// Backgrounds (Dark Mode)
const darkBg = '#2D1B4E';      // Deep "Console" Purple
const darkCard = '#432C7A';    // Lighter Purple Tile

// Borders
const hardBorder = '#000000';  // Pitch black for the "Cartoon Outline" look

export const Colors = {
  light: {
    text: '#2D1B4E',           // Dark Purple text (softer than black)
    textSecondary: '#6366F1',  // Bright Indigo for subtitles
    textMuted: '#94A3B8',
    background: lightBg,
    backgroundSecondary: '#F3E8FF', // Light lavender
    card: lightCard,
    
    // Brand Colors
    tint: gamePink,
    primary: gamePink,
    primaryLight: '#FFACE4',   // Pastel Pink
    
    // Feedback Colors
    success: '#00C851',        // Solid Green (readable on light)
    successLight: '#CBF6D9',
    warning: '#FFAB00',        // Deep Orange-Yellow
    warningLight: '#FFF6D1',
    error: gameRed,
    errorLight: '#FFD1D9',
    info: '#0099CC',
    infoLight: '#D1F4FF',
    
    // UI Elements
    border: hardBorder,        // Bold borders!
    borderLight: '#E2E8F0',
    icon: '#2D1B4E',
    tabIconDefault: '#C7C7CC',
    tabIconSelected: gamePink,
    
    // Shadows - Hard, non-blurry shadows for that "Pop Art" look
    shadow: '#000000', 
    overlay: 'rgba(45, 27, 78, 0.6)', // Purple tint overlay
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: gameCyan,   // Neon Blue text in dark mode
    textMuted: '#A39AC3',
    background: darkBg,
    backgroundSecondary: '#1F1235',
    card: darkCard,
    
    // Brand Colors
    tint: gameCyan,            // Cyan pops better on dark than Pink
    primary: gamePink,
    primaryLight: '#70183F',
    
    // Feedback Colors
    success: gameGreen,        // Neon Green
    successLight: '#08360D',
    warning: gameYellow,       // Neon Gold
    warningLight: '#423600',
    error: gameRed,
    errorLight: '#450914',
    info: gameCyan,
    infoLight: '#00363D',
    
    // UI Elements
    border: '#000000',         // Still black borders in dark mode
    borderLight: '#5B4B8A',
    icon: '#FFFFFF',
    tabIconDefault: '#695D85',
    tabIconSelected: gameCyan,
    
    // Shadows
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.8)',
  },
};

export const Spacing = {
  xs: 6,   // Increased slightly for more "breathing room"
  sm: 10,
  md: 20,  // Standard gap is now chunky
  lg: 30,
  xl: 40,
  xxl: 60,
};

// ROUNDNESS: High numbers = "Bubbly/Toy" feel
export const BorderRadius = {
  sm: 12,
  md: 20,  // Standard buttons
  lg: 30,  // Cards
  xl: 40,  // Floating Action Buttons
  full: 9999,
};

// FONTS: Added "Rounded" variants to the stack priority
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui', 
    serif: 'ui-serif',
    rounded: 'Arial Rounded MT Bold', // Built-in iOS rounded font
    mono: 'Menlo',
  },
  default: {
    sans: 'sans-serif',
    serif: 'serif',
    rounded: 'sans-serif-condensed',
    mono: 'monospace',
  },
  web: {
    // Prioritizing rounded fonts for the web
    sans: "'Fredoka', 'Nunito', 'Quicksand', system-ui, sans-serif",
    serif: "'Merriweather', serif",
    rounded: "'Fredoka', 'Nunito', sans-serif",
    mono: "'Fira Code', monospace",
  },
});

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20, // Larger body text is friendlier
  xl: 24,
  xxl: 30,
  xxxl: 40,
  display: 56, // Massive headers for "Level Up" screens
};

export const FontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '700' as const, // Bumped up: Games use bold text often
  bold: '800' as const,
  extrabold: '900' as const,
};