import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../styles/theme';

type ButtonType = 'primary' | 'secondary' | 'outline' | 'link';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  type?: ButtonType;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Custom Button component for consistent UI across the app
 */
const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  ...props
}) => {
  // Determine button style based on type
  const getButtonStyle = (): ViewStyle => {
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
  const getTextStyle = (): TextStyle => {
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
      {...props}
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