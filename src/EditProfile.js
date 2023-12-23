import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, Input } from 'react-native-elements';
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

  const handleSaveProfile = async () => {
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <Input
        label="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="none"
      />
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <Input
        label="Password (leave blank to keep current)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
            <Input
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button 
        title="Save Profile" 
        onPress={handleSaveProfile} 
        loading={loading}
        containerStyle={styles.button} 
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
});

export default EditProfile;
