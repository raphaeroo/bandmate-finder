import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING } from '../../styles/theme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Header from '../../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Validate email format with a simple regex
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would make an API call
      // For now, we'll just simulate a successful reset
      setTimeout(() => {
        setResetSent(true);
        setLoading(false);
      }, 1500);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send reset email');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header 
        title="Forgot Password" 
        onBackPress={() => navigation.goBack()} 
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
          {!resetSent ? (
            <View style={styles.formContainer}>
              <Text style={styles.title}>Reset Your Password</Text>
              <Text style={styles.instructions}>
                Enter your email address and we'll send you instructions on how to reset your password.
              </Text>
              
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
              
              <Button
                title="Send Reset Link"
                onPress={handleResetPassword}
                loading={loading}
                style={styles.button}
              />
            </View>
          ) : (
            <View style={styles.successContainer}>
              <Ionicons
                name="mail"
                size={80}
                color={COLORS.PRIMARY}
                style={styles.successIcon}
              />
              <Text style={styles.successTitle}>Check Your Email</Text>
              <Text style={styles.successText}>
                We've sent password reset instructions to {email}
              </Text>
              <Button
                title="Back to Login"
                onPress={() => navigation.navigate('Login')}
                style={styles.button}
              />
            </View>
          )}
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
  formContainer: {
    width: '100%',
    marginTop: SPACING.LARGE,
  },
  title: {
    fontSize: FONT_SIZE.EXTRA_LARGE,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.MEDIUM,
  },
  instructions: {
    fontSize: FONT_SIZE.MEDIUM,
    color: COLORS.GRAY,
    marginBottom: SPACING.LARGE,
  },
  button: {
    marginTop: SPACING.LARGE,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.EXTRA_LARGE,
  },
  successIcon: {
    marginBottom: SPACING.LARGE,
  },
  successTitle: {
    fontSize: FONT_SIZE.EXTRA_LARGE,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.MEDIUM,
    textAlign: 'center',
  },
  successText: {
    fontSize: FONT_SIZE.MEDIUM,
    color: COLORS.GRAY,
    marginBottom: SPACING.LARGE,
    textAlign: 'center',
    paddingHorizontal: SPACING.LARGE,
  },
});

export default ForgotPasswordScreen;
