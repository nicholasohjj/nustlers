import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import SearchStackScreen from "./search/searchStackScreen";
import TransactionsStackScreen from "./transaction/transactionsStackScreen";
import AccountStackScreen from "./account/accountStackScreen";
import { supabase } from "../supabase/supabase";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DefaultTheme } from 'react-native-paper';

const Content = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (!user) navigation.navigate("Welcome");
      } catch (error) {
        console.error("Authentication error:", error);
      }
    };
    checkUserLoggedIn();
  }, [navigation]);
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Search') {
            iconName = focused ? 'magnify' : 'magnify';
          } else if (route.name === 'Transactions') {
            iconName = focused ? 'swap-horizontal-bold' : 'swap-horizontal';
          } else if (route.name === 'Account') {
            iconName = focused ? 'account-circle' : 'account-circle-outline';
          } else if (route.name === 'Information') {
            iconName = focused ? 'information' : 'information-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: DefaultTheme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: "10%", // Adjust this value as needed
          paddingBottom: 5,
          backgroundColor: DefaultTheme.colors.surfaceVariant
          , // Set tab bar background color
          // Optional, for inner padding
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: 12,
          marginBottom: 6, // Adjust the bottom margin to increase spacing
        },
        tabBarIconStyle: {
          marginTop: 5, // Adjust the top margin to increase spacing
        },
      })}
    >
      <Tab.Screen name="Search" component={SearchStackScreen} />
      <Tab.Screen name="Transactions" component={TransactionsStackScreen} />
      <Tab.Screen name="Account" component={AccountStackScreen} />
    </Tab.Navigator>
  );
};


export default Content;
