/**
 * Theme configuration for BandMate Finder app
 */

export const COLORS = {
  PRIMARY: '#1A237E', // Dark blue for a professional look
  SECONDARY: '#EEEEEE', // Light grey for backgrounds and subtle elements
  ACCENT: '#26A69A', // Teal for highlights and call-to-action buttons
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  LIGHT_TEXT: '#FFFFFF',
  DARK_TEXT: '#333333',
  GRAY: '#9E9E9E',
  LIGHT_GRAY: '#E0E0E0',
  ERROR: '#F44336',
  SUCCESS: '#4CAF50',
  WARNING: '#FFC107',
  INFO: '#2196F3',
  TRANSPARENT: 'transparent',
};

export const FONT_SIZE = {
  TINY: 10,
  SMALL: 12,
  MEDIUM: 14,
  REGULAR: 16,
  LARGE: 18,
  EXTRA_LARGE: 24,
  HUGE: 32,
};

export const SPACING = {
  TINY: 4,
  SMALL: 8,
  MEDIUM: 16,
  LARGE: 24,
  EXTRA_LARGE: 32,
  HUGE: 48,
};

export const BORDER_RADIUS = {
  SMALL: 4,
  MEDIUM: 8,
  LARGE: 16,
  ROUND: 999,
};

export const SHADOWS = {
  SMALL: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  LARGE: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export default {
  COLORS,
  FONT_SIZE,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
};
