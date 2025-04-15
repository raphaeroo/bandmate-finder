import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../styles/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * Custom Input component for consistent UI across the app
 * 
 * @param {string} label - Input field label
 * @param {string} value - Input field value
 * @param {function} onChangeText - Function to call when text changes
 * @param {string} placeholder - Placeholder text
 * @param {boolean} secureTextEntry - Whether to hide text (for passwords)
 * @param {string} error - Error message to display
 * @param {boolean} multiline - Whether input is multiline
 * @param {string} keyboardType - Keyboard type
 * @param {number} maxLength - Maximum number of characters
 * @param {function} onBlur - Function to call when input loses focus
 * @param {function} onFocus - Function to call when input gains focus
 * @param {object} style - Additional styles for the input container
 * @param {object} inputStyle - Additional styles for the input field
 * @param {object} labelStyle - Additional styles for the label
 * @param {boolean} required - Whether field is required
 * @param {JSX} leftIcon - Custom icon to display on the left
 * @param {JSX} rightIcon - Custom icon to display on the right
 */
const Input = ({
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
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
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
          isFocused && styles.focused,
          error && styles.error,
          multiline && styles.multiline,
        ]}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            multiline && styles.multilineInput,
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
