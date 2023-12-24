import Main from "./src/Main";
import { NavigationContainer } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { UserProvider } from './src/Home/UserProvider'

const prefix = Linking.createURL('/');

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
      Home: {
        path: 'home',
        screens: {
          Content: {
            path: 'content',
            screens: {
              Map: 'map',
              Display: 'display',
              Sample: 'sample',
              Account: 'account',
            },
          },
          EditProfile: 'editprofile',
          // Add other nested routes under 'Home' here if any
        },
      },
      Login: 'login',
      Signup: 'signup',
      // Add other top-level routes here if any
    },
  },
};
const App = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer linking={linking}>
        <UserProvider>
        <Main />

        </UserProvider>

      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
