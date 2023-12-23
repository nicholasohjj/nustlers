import Main from "./src/Main";
import { NavigationContainer } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

const prefix = Linking.createURL("/");

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: '#000000', // Set the text color to black
    // You can also define other color properties as needed
  },
};

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
    <PaperProvider theme={theme}>
      <NavigationContainer linking={linking}>
        <Main />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
