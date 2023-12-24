import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Menu, Provider } from 'react-native-paper';

const Feedback = () => {
  const [selectedTopic, setSelectedTopic] = useState('Account');
  const [feedbackText, setFeedbackText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const handleSubmit = () => {
    // Handle the submit action
    console.log('Submitted Feedback:', selectedTopic, feedbackText);
    // Add logic to send feedback to a server or handle it as needed
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
              style={styles.menuButton}
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
          numberOfLines={5}  // Adjust number of lines for bigger text area
          onChangeText={setFeedbackText}
          value={feedbackText}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
        >
          Submit
        </Button>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  menuButton: {
    marginBottom: 20,
    width: '100%', // Set button width to full container width
  },
  input: {
    marginBottom: 20,
    height: 120, // Increase height for bigger text area
  },
  button: {
    marginTop: 10,
  },
});

export default Feedback;
