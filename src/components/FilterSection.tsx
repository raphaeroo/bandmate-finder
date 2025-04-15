import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../styles/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Option {
  id: string | number;
  name: string;
}

interface FilterSectionProps {
  options?: Option[];
  selectedOptions?: Option[];
  onSelectOption?: (option: Option) => void;
  title?: string;
  multiSelect?: boolean;
  collapsible?: boolean;
}

/**
 * FilterSection component for displaying and selecting filter options
 */
const FilterSection: React.FC<FilterSectionProps> = ({
  options = [],
  selectedOptions = [],
  onSelectOption,
  title,
  multiSelect = true,
  collapsible = true,
}) => {
  const [collapsed, setCollapsed] = React.useState(false);

  const toggleCollapsed = () => {
    if (collapsible) {
      setCollapsed(!collapsed);
    }
  };

  const isSelected = (option: Option): boolean => {
    return selectedOptions.some((selectedOption) => selectedOption.id === option.id);
  };

  const handleSelectOption = (option: Option) => {
    if (onSelectOption) {
      onSelectOption(option);
    }
  };

  return (
    <View style={styles.container}>
      {title && (
        <TouchableOpacity
          style={styles.header}
          onPress={toggleCollapsed}
          disabled={!collapsible}
        >
          <Text style={styles.title}>{title}</Text>
          {collapsible && (
            <Ionicons
              name={collapsed ? 'chevron-down' : 'chevron-up'}
              size={20}
              color={COLORS.DARK_TEXT}
            />
          )}
        </TouchableOpacity>
      )}

      {!collapsed && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.optionsContainer}
        >
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                isSelected(option) && styles.selectedOption,
              ]}
              onPress={() => handleSelectOption(option)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected(option) && styles.selectedOptionText,
                ]}
              >
                {option.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MEDIUM,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.SMALL,
  },
  title: {
    fontSize: FONT_SIZE.REGULAR,
    fontWeight: 'bold',
    color: COLORS.DARK_TEXT,
  },
  optionsContainer: {
    paddingVertical: SPACING.SMALL,
    paddingRight: SPACING.MEDIUM,
  },
  optionButton: {
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL,
    borderRadius: BORDER_RADIUS.ROUND,
    backgroundColor: COLORS.SECONDARY,
    marginRight: SPACING.SMALL,
    marginBottom: SPACING.SMALL,
  },
  selectedOption: {
    backgroundColor: COLORS.PRIMARY,
  },
  optionText: {
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.DARK_TEXT,
  },
  selectedOptionText: {
    color: COLORS.WHITE,
    fontWeight: '500',
  },
});

export default FilterSection; 