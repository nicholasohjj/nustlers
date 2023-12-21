import React, { useState } from 'react'
import { Alert, StyleSheet, View, ActivityIndicator } from 'react-native';
import { supabase } from './supabase'
import { Button, Input } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';

const Auth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const navigation = useNavigation();

  const handleAuth = async (action) => {
    if (!email || !password) {
      Alert.alert('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const response = action === 'signIn'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    const { error, data: { session } } = response;

    if (error) {
      Alert.alert('Authentication Error', error.message);
    } else if (session) {
      navigation.navigate('Home');
    } else {
      Alert.alert('Verification Needed', 'Please check your inbox for email verification!');
    }

    setLoading(false);
  };
  



  return (
    <View style={styles.container}>
      <Input
        label="Email"
        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
        onChangeText={setEmail}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
      />
      <Input
        label="Password"
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
        rightIcon={{
          type: 'font-awesome',
          name: passwordVisibility ? 'eye-slash' : 'eye',
          onPress: () => setPasswordVisibility(!passwordVisibility),
        }}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={passwordVisibility}
        placeholder="Password"
        autoCapitalize="none"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="Sign in" onPress={() => handleAuth('signIn')} />
          <Button title="Sign up" onPress={() => handleAuth('signUp')} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})

export default Auth