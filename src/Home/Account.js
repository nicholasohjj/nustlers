import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { List, Divider } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase";

const Account = () => {
    const navigation = useNavigation(); // Get the navigation object
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          Alert.alert("Logout Failed", "An error occurred while logging out.");
        } else {
          navigation.navigate("Welcome");
        }
        
      };

      const handleEditProfile = () => {
        navigation.navigate("EditProfile");
      };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Account</Text>
        <List.Section>
          <ListItem title="Edit Profile" icon="account-edit" onPress={handleEditProfile}/>
          <ListItem title="Transaction History" icon="history"onPress={handleEditProfile} />
          <ListItem title="Settings" icon="cog"onPress={handleEditProfile} />
          <ListItem title="Feedback" icon="comment-outline"onPress={handleEditProfile} />
          <ListItem title="FAQ/Live Chat" icon="chat" onPress={handleEditProfile}/>
          <ListItem title="About the App" icon="information" onPress={handleEditProfile}/>
          <ListItem title="Terms and Conditions" icon="file-document"onPress={handleEditProfile} />
          <ListItem title="Privacy Policy" icon="shield-account"onPress={handleEditProfile} />
          <ListItem title="Log Out" icon="logout" onPress={handleLogout}/>
        </List.Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const ListItem = ({ title, icon, onPress }) => (
  <>
    <List.Item
      title={title}
      onPress={onPress}
      right={() => <List.Icon icon={icon} />}
    />
    <Divider />
  </>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // or any other background color you prefer
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 30, // Increase top margin to lower the title
    marginBottom: 20,
    textAlign: 'left',
    paddingHorizontal: 20,
    color: '#000000',
  },
});

export default Account;
