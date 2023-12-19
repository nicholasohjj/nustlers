import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
  },
});

const Dashboard = () => {
  return (

    <View style={styles.container}>
        <Text>Dashboard Text</Text>   
    </View>

    );
}

export default Dashboard
