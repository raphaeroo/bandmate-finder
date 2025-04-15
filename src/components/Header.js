import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from '../styles/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Header component for consistent UI across screens
 * 
 * @param {string} title - Header title
 * @param {function} onBackPress - Function to call when back button is pressed
 * @param {function} onRightPress - Function to call when right button is pressed
 * @param {string} rightIcon - Icon name for right button
 * @param {string} rightText - Text for right button
 * @param {boolean} transparent - Whether header is transparent
 * @param {boolean} light - Whether to use light text color
 * @param {object} style - Additional styles for header container
 */
const Header = ({
  title,
  onBackPress,
  onRightPress,
  rightIcon,
  rightText,
  transparent = false,
  light = false,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const statusBarHeight = insets.top;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: statusBarHeight,
          backgroundColor: transparent ? 'transparent' : COLORS.PRIMARY,
        },
        style,
      ]}
    >
      <StatusBar
        barStyle={light || !transparent ? 'light-content' : 'dark-content'}
        backgroundColor={transparent ? 'transparent' : COLORS.PRIMARY}
        translucent
      />
      <View style={styles.content}>
        <View style={styles.leftContainer}>
          {onBackPress && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBackPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="chevron-back"
                size={28}
                color={light || !transparent ? COLORS.WHITE : COLORS.DARK_TEXT}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              { color: light || !transparent ? COLORS.WHITE : COLORS.DARK_TEXT },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        <View style={styles.rightContainer}>
          {(rightIcon || rightText) && onRightPress && (
            <TouchableOpacity
              style={styles.rightButton}
              onPress={onRightPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {rightIcon && (
                <Ionicons
                  name={rightIcon}
                  size={24}
                  color={light || !transparent ? COLORS.WHITE : COLORS.DARK_TEXT}
                  style={rightText ? { marginRight: SPACING.TINY } : null}
                />
              )}
              {rightText && (
                <Text
                  style={[
                    styles.rightText,
                    {
                      color: light || !transparent ? COLORS.WHITE : COLORS.DARK_TEXT,
                    },
                  ]}
                >
                  {rightText}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: SPACING.MEDIUM,
  },
  leftContainer: {
    minWidth: 40,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: FONT_SIZE.LARGE,
    fontWeight: 'bold',
  },
  backButton: {
    padding: SPACING.TINY,
  },
  rightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.TINY,
  },
  rightText: {
    fontSize: FONT_SIZE.REGULAR,
    fontWeight: '500',
  },
});

export default Header;
