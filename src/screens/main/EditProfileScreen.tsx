import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../styles/theme';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/MainNavigator';
import { useAuth } from '../../contexts/AuthContext';

type EditProfileScreenProps = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

interface ProfileData {
  name: string;
  bio: string;
  location: {
    city: string;
    state: string;
  };
  genres: string[];
  instruments: string[];
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    bio: '',
    location: {
      city: '',
      state: '',
    },
    genres: [],
    instruments: [],
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      setTimeout(() => {
        setProfileData({
          name: 'John Doe',
          bio: 'Passionate musician with 10 years of experience',
          location: {
            city: 'New York',
            state: 'NY',
          },
          genres: ['Rock', 'Jazz'],
          instruments: ['Guitar', 'Piano'],
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading profile data:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        setSaving(false);
        navigation.goBack();
      }, 1000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Edit Profile"
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Edit Profile"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={profileData.name}
            onChangeText={(text) => setProfileData({ ...profileData, name: text })}
            placeholder="Enter your name"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={profileData.bio}
            onChangeText={(text) => setProfileData({ ...profileData, bio: text })}
            placeholder="Tell us about yourself"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Location</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              value={profileData.location.city}
              onChangeText={(text) =>
                setProfileData({
                  ...profileData,
                  location: { ...profileData.location, city: text },
                })
              }
              placeholder="City"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              value={profileData.location.state}
              onChangeText={(text) =>
                setProfileData({
                  ...profileData,
                  location: { ...profileData.location, state: text },
                })
              }
              placeholder="State"
            />
          </View>
        </View>

        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={saving}
          style={styles.saveButton}
        />
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
    padding: SPACING.MEDIUM,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: SPACING.LARGE,
  },
  label: {
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.DARK_TEXT,
    marginBottom: SPACING.SMALL,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: BORDER_RADIUS.MEDIUM,
    padding: SPACING.MEDIUM,
    fontSize: FONT_SIZE.REGULAR,
    color: COLORS.DARK_TEXT,
  },
  bioInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  saveButton: {
    marginTop: SPACING.MEDIUM,
  },
});

export default EditProfileScreen; 