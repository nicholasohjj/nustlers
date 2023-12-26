import React from "react";
import { Avatar, Button, Card, Text, Icon } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Sample from "./Sample";
import PropTypes from 'prop-types';

const ContentStack = createNativeStackNavigator();

// Modularized SidebarButton
const SidebarButton = ({ iconName, label, onPress }) => (
  <Button mode="text" onPress={onPress} style={styles.button}>
    <Icon source={iconName} size={20} />
    <Text>{label}</Text>
  </Button>
);

SidebarButton.propTypes = {
  iconName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const Sidebar = () => {
  const getIconName = label => {
    switch (label) {
      case 'Home': return 'home';
      case 'Hub': return 'hub';
      case 'Help': return 'help';
      default: return 'default-icon';
    }
  };

  return (
    <View style={styles.sidebar}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Name</Text>
        </Card.Content>
      </Card>

      {['Home', 'Hub', 'Help'].map(label => (
        <SidebarButton 
          key={label} 
          iconName={getIconName(label)} 
          label={label} 
          onPress={() => console.log(`${label} Pressed`)} 
        />
      ))}
    </View>
  );
};

const Content = () => (
  <View style={styles.container}>
    <Sidebar />
    <ContentStack.Navigator
      initialRouteName="Sample"
      screenOptions={{ headerShown: false }}
    >
      <ContentStack.Screen name="Sample" component={Sample} />
    </ContentStack.Navigator>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginBottom: 10, // Space between card and buttons
  },
  button: {
    marginBottom: 10, // Space between buttons
  },
  // Add more styles as needed
});

export default Content;
