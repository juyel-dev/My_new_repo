import { Platform } from 'react-native';

export const PALETTE = {
  // Base backgrounds
  bg: '#0a0a0a',
  bgElevated: '#141414',
  bgCard: '#1a1a1a',
  bgInput: '#1f1f1f',
  bgChip: '#262626',
  bgOverlay: 'rgba(0,0,0,0.6)',

  // Primary accent - violet
  violet: '#8b5cf6',
  violetMuted: 'rgba(139,92,246,0.12)',
  violetBorder: 'rgba(139,92,246,0.25)',
  violetGlow: 'rgba(139,92,246,0.08)',

  // Text hierarchy
  text: '#f2f2f2',
  textMuted: '#a1a1aa',
  textDim: '#71717a',
  textFaint: '#52525b',

  // Semantic borders
  border: 'rgba(255,255,255,0.08)',
  borderMid: 'rgba(255,255,255,0.12)',

  // Status colors
  success: '#4ade80',
  successMuted: 'rgba(74,222,128,0.12)',
  warning: '#fbbf24',
  warningMuted: 'rgba(251,191,36,0.12)',
  error: '#ef4444',
  errorMuted: 'rgba(239,68,68,0.10)',
  errorBorder: 'rgba(239,68,68,0.25)',
  info: '#3b82f6',
  infoMuted: 'rgba(59,130,246,0.12)',

  // Core
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorPalette = typeof PALETTE;

const common = {
  primary: PALETTE.violet,
  primaryMuted: PALETTE.violetMuted,
  primaryBorder: PALETTE.violetBorder,
  primaryGlow: PALETTE.violetGlow,

  success: PALETTE.success,
  successMuted: PALETTE.successMuted,
  warning: PALETTE.warning,
  warningMuted: PALETTE.warningMuted,
  destructive: PALETTE.error,
  destructiveMuted: PALETTE.errorMuted,
  destructiveBorder: PALETTE.errorBorder,
  info: PALETTE.info,
  infoMuted: PALETTE.infoMuted,

  foreground: PALETTE.text,
  mutedForeground: PALETTE.textMuted,

  border: PALETTE.border,
  borderMid: PALETTE.borderMid,
  overlay: PALETTE.bgOverlay,
} as const;

const dark = {
  background: PALETTE.bg,
  backgroundElevated: PALETTE.bgElevated,
  card: PALETTE.bgCard,
  input: PALETTE.bgInput,
  chip: PALETTE.bgChip,
  text: PALETTE.text,
  textMuted: PALETTE.textMuted,
  textDim: PALETTE.textDim,
  textFaint: PALETTE.textFaint,
  ...common,
} as const;

const light = {
  background: '#fafafa',
  backgroundElevated: '#f5f5f5',
  card: '#ffffff',
  input: '#f0f0f0',
  chip: '#e5e5e5',
  text: '#18181b',
  textMuted: '#52525b',
  textDim: '#71717a',
  textFaint: '#a1a1aa',
  ...common,
} as const;

export type ThemeColors = typeof dark;

export const colors = {
  dark,
  light,
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
    },
  },
} as const;

export const MONO_FONT = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

export default colors;
