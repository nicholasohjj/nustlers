import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { Button, TextInput } from 'react-native-paper'
import { Input } from 'react-native-elements';
import { supabase } from './supabase';
import { useNavigation } from "@react-navigation/native";

const EditProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();


  useEffect(() => {
    // Fetch the current user's profile data
    const fetchProfile = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
            
      if (user) {
        console.log(user.user_metadata)
        // Set the state to the current user's profile info
        setName(user.user_metadata.displayName || '');
        setEmail(user.email || '');
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const isValidEmail = email => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const isValidPhone = phone => {
    const re = /^\d+$/;
    return re.test(phone);
  };

  const handleSaveProfile = async () => {
    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!isValidPhone(phone)) {
      Alert.alert("Invalid Phone Number", "Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    console.log(phone)
    const { data, error } = await supabase.auth.updateUser({password,
        data: {
            displayName: name,
            phone: parseInt(phone, 10)
        }
    })

    console.log(data, error)
    // Add logic to update user's profile
    // You might need to update user's email, name, or password
    // Example: await supabase.auth.update({ email, password, data: { name } });
    setLoading(false);
    console.log('Profile Updated', 'Your profile has been updated successfully.');
    navigation.navigate("Content");

  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        label="Name"
        mode="outlined"
        onChangeText={setName}
        value={name}
        placeholder="John Doe"
        style={styles.input}
        left={<TextInput.Icon name="account" />}
      />
      <TextInput
        label="Email"
        mode="outlined"
        onChangeText={setEmail}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        left={<TextInput.Icon name="email" />}
      />
      <TextInput
        label="Phone Number"
        mode="outlined"
        onChangeText={setPhone}
        value={phone}
        placeholder="87654321"
        autoCapitalize="none"
        keyboardType="numeric"
        style={styles.input}
        left={<TextInput.Icon name="phone" />}
      />
      <TextInput
        label="Password (leave blank to keep current)"
        mode="outlined"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        placeholder="Password"
        autoCapitalize="none"
        style={styles.input}
        left={<TextInput.Icon name="lock" />}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.activityIndicator} />
      ) : (
        <Button 
          mode="contained" 
          onPress={handleSaveProfile} 
          style={styles.button}
        >
          Save Profile
        </Button>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#000000",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
    width: '100%',
    maxWidth: 400,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    width: Platform.OS === 'web' ? '50%' : '100%',
    maxWidth: 400,
  },
  activityIndicator: {
    marginVertical: 20,
  },
});
export default EditProfile;
