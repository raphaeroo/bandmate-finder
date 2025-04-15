import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../styles/theme';
import Header from '../../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/MainNavigator';
import { useAuth } from '../../contexts/AuthContext';

type SettingsScreenProps = NativeStackScreenProps<ProfileStackParamList, 'Settings'>;

interface SettingItem {
  id: string;
  title: string;
  icon: string;
  type: 'toggle' | 'navigate';
  value?: boolean;
  onPress?: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { logout } = useAuth();
  const [settings, setSettings] = useState<SettingItem[]>([
    {
      id: 'notifications',
      title: 'Push Notifications',
      icon: 'notifications-outline',
      type: 'toggle',
      value: true,
    },
    {
      id: 'email',
      title: 'Email Notifications',
      icon: 'mail-outline',
      type: 'toggle',
      value: true,
    },
    {
      id: 'privacy',
      title: 'Privacy Settings',
      icon: 'lock-closed-outline',
      type: 'navigate',
      onPress: () => navigation.navigate('PrivacySettings'),
    },
    {
      id: 'account',
      title: 'Account Settings',
      icon: 'person-outline',
      type: 'navigate',
      onPress: () => navigation.navigate('AccountSettings'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      type: 'navigate',
      onPress: () => navigation.navigate('HelpSupport'),
    },
    {
      id: 'about',
      title: 'About',
      icon: 'information-circle-outline',
      type: 'navigate',
      onPress: () => navigation.navigate('About'),
    },
  ]);

  const handleToggle = (id: string) => {
    setSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === id
          ? { ...setting, value: !setting.value }
          : setting
      )
    );
  };

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={item.type === 'navigate' ? item.onPress : undefined}
    >
      <View style={styles.settingContent}>
        <Ionicons
          name={item.icon}
          size={24}
          color={COLORS.DARK_TEXT}
          style={styles.icon}
        />
        <Text style={styles.title}>{item.title}</Text>
      </View>
      {item.type === 'toggle' && (
        <Switch
          value={item.value}
          onValueChange={() => handleToggle(item.id)}
          trackColor={{ false: COLORS.LIGHT_GRAY, true: COLORS.PRIMARY }}
          thumbColor={COLORS.WHITE}
        />
      )}
      {item.type === 'navigate' && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={COLORS.GRAY}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Settings"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          {settings.map(renderSettingItem)}
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <Ionicons
            name="log-out-outline"
            size={24}
            color={COLORS.ERROR}
            style={styles.icon}
          />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  container: {
    flex: 1,
  },
  section: {
    marginTop: SPACING.MEDIUM,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MEDIUM,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.MEDIUM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: SPACING.MEDIUM,
  },
  title: {
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.DARK_TEXT,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.MEDIUM,
    marginTop: SPACING.LARGE,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MEDIUM,
  },
  logoutText: {
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.ERROR,
    marginLeft: SPACING.MEDIUM,
  },
});

export default SettingsScreen; 