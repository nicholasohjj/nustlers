import React from "react";
import Main from "./src/main";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { UserProvider } from "./src/supabase/userProvider";

const prefix = Linking.createURL("/");

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: "#000000", // Set the text color to black
    // You can also define other color properties as needed
  },
};

const linking = {
  prefixes: [prefix],
  config: {
    screens: {
      Home: {
        path: "home",
        screens: {
          Content: {
            path: "content",
            screens: {
              Map: "map",
              Display: "display",
              Sample: "sample",
              Account: "account",
            },
          },
          EditProfile: "editprofile",
          Feedback: "feedback2",
          // Add other nested routes under 'Home' here if any
        },
      },
      Login: "login",
      Signup: "signup",
      Login: "verify", // Add this line for email verification
      // Add other top-level routes here if any
    },
  },
};
const App = () => {
  const navigationRef = useNavigationContainerRef();
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer linking={linking} ref={navigationRef}>
        <UserProvider>
          <Main />
        </UserProvider>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
