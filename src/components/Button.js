import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../styles/theme';

/**
 * Custom Button component for consistent UI across the app
 * 
 * @param {string} title - Button text
 * @param {function} onPress - Function to call when button is pressed
 * @param {string} type - Button type (primary, secondary, outline, link)
 * @param {boolean} loading - Whether to show loading indicator
 * @param {boolean} disabled - Whether button is disabled
 * @param {object} style - Additional styles for the button container
 * @param {object} textStyle - Additional styles for the button text
 */
const Button = ({
  title,
  onPress,
  type = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  // Determine button style based on type
  const getButtonStyle = () => {
    switch (type) {
      case 'primary':
        return styles.primary;
      case 'secondary':
        return styles.secondary;
      case 'outline':
        return styles.outline;
      case 'link':
        return styles.link;
      default:
        return styles.primary;
    }
  };

  // Determine text style based on type
  const getTextStyle = () => {
    switch (type) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'link':
        return styles.linkText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={type === 'outline' || type === 'link' ? COLORS.PRIMARY : COLORS.WHITE}
          size="small"
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.LARGE,
    borderRadius: BORDER_RADIUS.MEDIUM,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  primary: {
    backgroundColor: COLORS.PRIMARY,
  },
  secondary: {
    backgroundColor: COLORS.ACCENT,
  },
  outline: {
    backgroundColor: COLORS.TRANSPARENT,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  link: {
    backgroundColor: COLORS.TRANSPARENT,
    paddingVertical: SPACING.SMALL,
    paddingHorizontal: 0,
    minWidth: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  primaryText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.REGULAR,
    fontWeight: 'bold',
  },
  secondaryText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZE.REGULAR,
    fontWeight: 'bold',
  },
  outlineText: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZE.REGULAR,
    fontWeight: 'bold',
  },
  linkText: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZE.REGULAR,
    fontWeight: 'bold',
  },
});

export default Button;
