import Main from "./src/Main";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";


const linking = {
  prefixes: [], // Add your app's prefix here if necessary
  config: {
    screens: {
      Home: "home",
      Login: "login",
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
