import {React, useEffect} from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { supabase } from './supabase';
import { useNavigation } from '@react-navigation/native';

const { data: { user } } = await supabase.auth.getUser()



const HomeScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      navigation.navigate('Login');
    }
  };
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Logout Failed', 'An error occurred while logging out.');
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Text>{JSON.stringify(user)}</Text>
      <Button 
        title="Logout" 
        onPress={handleLogout} 
        containerStyle={styles.logoutButton} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    marginTop: 20,
  },
});

export default HomeScreen;
