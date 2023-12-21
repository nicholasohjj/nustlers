import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import Auth from './Auth';
import { supabase } from './supabase';
import HomeScreen from './HomeScreen';

const Stack = createNativeStackNavigator();

const Main = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const handleSessionStateChange = (_event, session) => {
      setSession(session);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(handleSessionStateChange);

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Home">
        {(props) => <HomeScreen {...props} session={session} />}
      </Stack.Screen>
            <Stack.Screen name="Login" component={Auth} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Main;
