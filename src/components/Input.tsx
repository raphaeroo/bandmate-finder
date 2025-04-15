import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TextInputProps,
  KeyboardTypeOptions,
} from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../styles/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  onBlur?: () => void;
  onFocus?: () => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Custom Input component for consistent UI across the app
 */
const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  multiline = false,
  keyboardType = 'default',
  maxLength,
  onBlur,
  onFocus,
  style,
  inputStyle,
  labelStyle,
  required = false,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          isFocused ? styles.focused : null,
          error ? styles.error : null,
          multiline ? styles.multiline : null,
        ]}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : null,
            (rightIcon || secureTextEntry) ? styles.inputWithRightIcon : null,
            multiline ? styles.multilineInput : null,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.GRAY}
          secureTextEntry={isSecure}
          multiline={multiline}
          keyboardType={keyboardType}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={toggleSecureEntry}
          >
            <Ionicons
              name={isSecure ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={COLORS.GRAY}
            />
          </TouchableOpacity>
        )}
        {rightIcon && !secureTextEntry && (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MEDIUM,
    width: '100%',
  },
  label: {
    fontSize: FONT_SIZE.SMALL,
    marginBottom: SPACING.TINY,
    color: COLORS.DARK_TEXT,
    fontWeight: '500',
  },
  required: {
    color: COLORS.ERROR,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    borderRadius: BORDER_RADIUS.MEDIUM,
    backgroundColor: COLORS.WHITE,
  },
  focused: {
    borderColor: COLORS.PRIMARY,
  },
  error: {
    borderColor: COLORS.ERROR,
  },
  multiline: {
    minHeight: 100,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.MEDIUM,
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.DARK_TEXT,
  },
  inputWithLeftIcon: {
    paddingLeft: SPACING.TINY,
  },
  inputWithRightIcon: {
    paddingRight: SPACING.TINY,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  leftIconContainer: {
    paddingHorizontal: SPACING.MEDIUM,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    paddingHorizontal: SPACING.MEDIUM,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: FONT_SIZE.SMALL,
    marginTop: SPACING.TINY,
  },
});

export default Input; 