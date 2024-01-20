import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Text, TextInput, Button, ActivityIndicator } from 'react-native-paper';  
import { supabase } from "../supabase/supabase";

const isValidEmail = email => {
  // Simple regex for email validation
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        console.log("Redirecting to reset password")
      }
    })
  }, [])

  const handleResetPassword = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth
      .resetPasswordForEmail(email)


      // Implement your password reset logic here
      // Example: await yourBackendService.resetPassword(email);
      
      Alert.alert('Password Reset', `Instructions to reset your password have been sent to ${email}`);
      // Optionally navigate back to the login screen
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Your Password</Text>
      <Text>Enter your email address to receive password reset instructions</Text>

      <TextInput
        label="Email"
        mode="outlined"
        onChangeText={setEmail}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        left={<TextInput.Icon icon="email" />}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          mode="contained"
          onPress={handleResetPassword}
          style={styles.button}
          disabled={isLoading}
        >
          Reset Password
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000000',
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
    width: '100%',
    maxWidth: 400,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    width: '100%',
    maxWidth: 400,
  },
});

export default ResetPassword;
