import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING, SHADOWS } from '../../styles/theme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, error, clearError } = useAuth();

  // Clear any existing errors when component mounts
  React.useEffect(() => {
    clearError();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // Navigation will be handled by the main navigator when auth state changes
    } catch (err) {
      Alert.alert('Login Failed', err.message || 'Please check your credentials and try again');
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>BandMate Finder</Text>
            <Text style={styles.tagline}>Connect with musicians and bands near you</Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={
                <Ionicons name="mail-outline" size={20} color={COLORS.GRAY} />
              }
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              leftIcon={
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.GRAY} />
              }
            />

            <TouchableOpacity
              onPress={navigateToForgotPassword}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              title="Log In"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING.EXTRA_LARGE,
    marginBottom: SPACING.LARGE,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: SPACING.MEDIUM,
  },
  appName: {
    fontSize: FONT_SIZE.HUGE,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.TINY,
  },
  tagline: {
    fontSize: FONT_SIZE.MEDIUM,
    color: COLORS.GRAY,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.LARGE,
  },
  forgotPasswordText: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZE.SMALL,
  },
  loginButton: {
    marginBottom: SPACING.LARGE,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: FONT_SIZE.MEDIUM,
    color: COLORS.DARK_TEXT,
  },
  registerLink: {
    fontSize: FONT_SIZE.MEDIUM,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
