import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { Text, TextInput, Button, Surface  } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import DropDown from "react-native-paper-dropdown";

const Feedback = () => {
  const [selectedTopic, setSelectedTopic] = useState('Account');
  const [feedbackText, setFeedbackText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);

  const topics = [
    {
      value: 'account',
      label: 'Account',
    },
    {
      value: 'general',
      label: 'General Feedback',
    },
    { value: 'payment', label: 'Payment' },
  ]

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
    <SafeAreaView style={styles.container}>
    <Text style={styles.title}>Feedback</Text>
        
          <SafeAreaView style={styles.dropdown}>
            <DropDown
              label={"Topic"}
              mode={"outlined"}
              visible={showDropDown}
              showDropDown={() => setShowDropDown(true)}
              onDismiss={() => setShowDropDown(false)}
              value={selectedTopic}
              setValue={setSelectedTopic}
              list={topics}
            />
          </SafeAreaView>

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
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
  },
  dropdown: {
    marginBottom: 15,
    width: "100%",
    maxWidth: 400,
  },
  title: {
    paddingTop: 40,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    paddingBottom: 20,
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
    width: "100%",
    maxWidth: 400,
  },
});

export default Feedback;
