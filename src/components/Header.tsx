import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from '../styles/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface HeaderProps {
  title?: string;
  onBackPress?: () => void;
  onRightPress?: () => void;
  rightIcon?: string;
  rightText?: string;
  transparent?: boolean;
  light?: boolean;
  style?: ViewStyle;
}

/**
 * Header component for consistent UI across screens
 */
const Header: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  onRightPress,
  rightIcon,
  rightText,
  transparent = false,
  light = false,
  style,
}) => {

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: 0,
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