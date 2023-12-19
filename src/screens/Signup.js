import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
  },
});

const Signup = () => {
  return (

    <View style={styles.container}>
        <Text>Signup Text</Text>   
    </View>

    );
}

export default Signup
