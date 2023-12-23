import Main from "./src/Main";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import * as Linking from "expo-linking";

const prefix = Linking.createURL("/");

const linking = {
  prefixes: [prefix],
  config: {
    screens: {
      Home: "home",
      Login: "login",
      Signup: "signup",
    },
  },
};

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer linking={linking}>
        <Main />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
