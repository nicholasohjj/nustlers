import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Text, TextInput, Button, Menu, Provider } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";

const Feedback = () => {
  const [selectedTopic, setSelectedTopic] = useState('Account');
  const [feedbackText, setFeedbackText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = () => {
    setLoading(true);
    console.log('Submitted Feedback:', selectedTopic, feedbackText);
    // Simulate a network request
    setTimeout(() => setLoading(false), 2000);
    // Add logic to send feedback to a server or handle it as needed
    navigation.navigate("Content");

  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.title}>Feedback</Text>
        
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button 
              mode="outlined" 
              onPress={() => setMenuVisible(true)} 
              style={styles.input}
            >
              {selectedTopic}
            </Button>
          }>
          <Menu.Item onPress={() => { setSelectedTopic('Account'); setMenuVisible(false); }} title="Account" />
          <Menu.Item onPress={() => { setSelectedTopic('General Feedback'); setMenuVisible(false); }} title="General Feedback" />
          <Menu.Item onPress={() => { setSelectedTopic('Payment'); setMenuVisible(false); }} title="Payment" />
        </Menu>

        <TextInput
          mode="outlined"
          label="Your feedback"
          multiline
          numberOfLines={5}
          onChangeText={setFeedbackText}
          value={feedbackText}
          style={styles.input}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Submit
          </Button>
        )}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 12,
    alignItems: "center",
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
    width: "100%",
    maxWidth: 400,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    width: Platform.OS === "web" ? "50%" : "100%",
    maxWidth: 400,
  },
});

export default Feedback;
