import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import { Button, TextInput, Dialog, Portal } from 'react-native-paper';
import { supabase } from '../supabase';
import { useNavigation } from "@react-navigation/native";
import { useUser  } from './UserProvider';

const EditProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [preferredName, setPreferredName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const { setUser } = useUser();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
          
    if (user) {
      console.log(user.user_metadata)
      setCurrentUser(user); // Store the user data in state
      setPreferredName(user.user_metadata.displayName || '');
      setEmail(user.email || '');
      setMobileNumber(user.user_metadata.phone.toString() || ''); // Convert to string

    }

    setLoading(false);
  };

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

    if (!isValidPhone(mobileNumber)) {
      Alert.alert("Invalid Phone Number", "Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    console.log(mobileNumber)
    const { data, error } = await supabase.auth.updateUser({
        data: {
            displayName: preferredName,
            phone: parseInt(mobileNumber, 10)
        }
    })
    setLoading(false);

    if (error) {
        Alert.alert(
          "Update Profile Error",
          error.message || "An error occurred during update profile."
        );

    } else {
      setVisible(true); // Show the dialog
      setTimeout(() => {
        setVisible(false); // Hide the dialog
        setUser({ ...currentUser, user_metadata: { ...currentUser.user_metadata, displayName: preferredName } });
        navigation.navigate("Content");
      }, 2000); // Close the dialog and navigate after 2 seconds
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        label="Preferred Name"
        mode="outlined"
        onChangeText={setPreferredName}
        value={preferredName}
        placeholder="Enter your preferred name"
        style={styles.input}
        left={<TextInput.Icon icon="account" />}
      />
      <TextInput
        label="Email"
        mode="outlined"
        onChangeText={setEmail}
        value={email}
        editable={false} // To make email read-only
        style={styles.input}
        left={<TextInput.Icon icon="email" />}
      />
      <TextInput
        label="Mobile Number"
        mode="outlined"
        onChangeText={setMobileNumber}
        value={mobileNumber}
        placeholder="Enter your mobile number"
        keyboardType="phone-pad"
        style={styles.input}
        left={<TextInput.Icon icon="phone" />}
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
        <Portal>
          <Dialog visible={visible} onDismiss={() => setVisible(false)} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Profile Updated</Dialog.Title>
          </Dialog>
        </Portal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
    width: '100%', // Full width of the screen
    maxWidth: 600, // Maximum width for larger screens
    alignSelf: 'center', // Center the container
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#000000',
  },
  input: {
    marginBottom: 18,
    backgroundColor: 'white',
    width: '100%',
    maxWidth: 400, // Maximum width for input fields
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 16,
    paddingVertical: 10,
    width: '80%', // Relative width for better appearance on web
    maxWidth: 400, // Maximum width for button
    alignSelf: 'center', // Center align the button
  },
  activityIndicator: {
    marginVertical: 20,
  },
  dialogTitle: {
    textAlign: 'center',
    fontSize: 20, // Larger font size for the dialog title
  },
  dialog: {
    flexGrow: 1,
    justifyContent: 'center',
    height: '100%', // Full height of the screen
    width: '100%', // Full width of the screen
    maxHeight: 600, // Maximum width for larger screens
    maxWidth: 600, // Maximum width for larger screens
    alignSelf: 'center', // Center the container
    
  }
});
export default EditProfile;
