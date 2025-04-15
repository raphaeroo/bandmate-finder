import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING } from '../../styles/theme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { USER_TYPES } from '../../utils/constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/MainNavigator';

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: Type selection, 2: Account details, 3: Profile details
  const [userType, setUserType] = useState<"musician" | "band">();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { register, error, clearError } = useAuth();

  // Clear any existing errors when component mounts
  React.useEffect(() => {
    clearError();
  }, []);

  const updateFormData = (key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleGoBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleContinue = () => {
    if (step === 1) {
      if (!userType) {
        Alert.alert('Error', 'Please select your account type');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Validate account details
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        Alert.alert('Error', 'Password should be at least 6 characters');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      // Final registration
      handleRegister();
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      // Combine all data for registration
      const userData = {
        ...formData,
        type: userType,
      };
      await register(userData);
      // Navigation will be handled by the main navigator when auth state changes
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  const renderTypeSelection = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>I am a...</Text>
      <Text style={styles.stepSubtitle}>Select your account type</Text>
      
      <TouchableOpacity
        style={[
          styles.typeOption,
          userType === USER_TYPES.MUSICIAN && styles.selectedType,
        ]}
        onPress={() => setUserType(USER_TYPES.MUSICIAN)}
        activeOpacity={0.7}
      >
        <Ionicons
          name="person"
          size={28}
          color={userType === USER_TYPES.MUSICIAN ? COLORS.WHITE : COLORS.PRIMARY}
        />
        <View style={styles.typeTextContainer}>
          <Text
            style={[
              styles.typeTitle,
              userType === USER_TYPES.MUSICIAN && styles.selectedTypeText,
            ]}
          >
            Musician
          </Text>
          <Text
            style={[
              styles.typeDescription,
              userType === USER_TYPES.MUSICIAN && styles.selectedTypeText,
            ]}
          >
            I play an instrument and want to join a band
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.typeOption,
          userType === USER_TYPES.BAND && styles.selectedType,
        ]}
        onPress={() => setUserType(USER_TYPES.BAND)}
        activeOpacity={0.7}
      >
        <Ionicons
          name="people"
          size={28}
          color={userType === USER_TYPES.BAND ? COLORS.WHITE : COLORS.PRIMARY}
        />
        <View style={styles.typeTextContainer}>
          <Text
            style={[
              styles.typeTitle,
              userType === USER_TYPES.BAND && styles.selectedTypeText,
            ]}
          >
            Band
          </Text>
          <Text
            style={[
              styles.typeDescription,
              userType === USER_TYPES.BAND && styles.selectedTypeText,
            ]}
          >
            We're looking for musicians to join our band
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!userType}
        />
      </View>
    </View>
  );

  const renderAccountDetails = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Account Details</Text>
      <Text style={styles.stepSubtitle}>Create your account</Text>
      
      <Input
        label="Name"
        value={formData.name}
        onChangeText={(text) => updateFormData('name', text)}
        placeholder="Your name or band name"
        leftIcon={<Ionicons name="person-outline" size={20} color={COLORS.GRAY} />}
        required
      />
      
      <Input
        label="Email"
        value={formData.email}
        onChangeText={(text) => updateFormData('email', text)}
        placeholder="Your email address"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon={<Ionicons name="mail-outline" size={20} color={COLORS.GRAY} />}
        required
      />
      
      <Input
        label="Password"
        value={formData.password}
        onChangeText={(text) => updateFormData('password', text)}
        placeholder="Create a password"
        secureTextEntry
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.GRAY} />}
        required
      />
      
      <Input
        label="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(text) => updateFormData('confirmPassword', text)}
        placeholder="Confirm your password"
        secureTextEntry
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.GRAY} />}
        required
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
        />
      </View>
    </View>
  );

  const renderProfileDetails = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Profile Details</Text>
      <Text style={styles.stepSubtitle}>
        {userType === USER_TYPES.MUSICIAN
          ? 'Add your musician details'
          : 'Add your band details'}
      </Text>
      
      {/* This section would include profile details based on user type */}
      {/* For brevity, we'll just show a placeholder for now */}
      <Text style={styles.placeholderText}>
        In a real app, this screen would include fields for:
        {userType === USER_TYPES.MUSICIAN ? (
          <>
            {'\n'}- Instruments you play
            {'\n'}- Music genres
            {'\n'}- Experience level
            {'\n'}- Location
          </>
        ) : (
          <>
            {'\n'}- Band name
            {'\n'}- Music genres
            {'\n'}- Looking for
            {'\n'}- Location
          </>
        )}
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Complete Registration"
          onPress={handleContinue}
          loading={loading}
        />
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderTypeSelection();
      case 2:
        return renderAccountDetails();
      case 3:
        return renderProfileDetails();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header 
        title="Create Account" 
        onBackPress={handleGoBack}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {renderCurrentStep()}
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.LARGE,
    paddingBottom: SPACING.EXTRA_LARGE,
  },
  stepContainer: {
    width: '100%',
    marginTop: SPACING.LARGE,
  },
  stepTitle: {
    fontSize: FONT_SIZE.EXTRA_LARGE,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.TINY,
  },
  stepSubtitle: {
    fontSize: FONT_SIZE.MEDIUM,
    color: COLORS.GRAY,
    marginBottom: SPACING.LARGE,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.MEDIUM,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GRAY,
    marginBottom: SPACING.MEDIUM,
  },
  selectedType: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  typeTextContainer: {
    marginLeft: SPACING.MEDIUM,
    flex: 1,
  },
  typeTitle: {
    fontSize: FONT_SIZE.REGULAR,
    fontWeight: 'bold',
    color: COLORS.DARK_TEXT,
    marginBottom: SPACING.TINY,
  },
  typeDescription: {
    fontSize: FONT_SIZE.SMALL,
    color: COLORS.GRAY,
  },
  selectedTypeText: {
    color: COLORS.WHITE,
  },
  buttonContainer: {
    marginTop: SPACING.LARGE,
  },
  placeholderText: {
    fontSize: FONT_SIZE.MEDIUM,
    color: COLORS.GRAY,
    marginTop: SPACING.MEDIUM,
    lineHeight: 24,
  },
});

export default RegisterScreen; 