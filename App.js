import React, { useEffect } from "react";
import Main from "./src/main";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { UserProvider } from "./src/supabase/userProvider";

const App = () => {
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const handleDeepLink = (event) => {
      const { path, queryParams } = Linking.parse(event.url);
      // Since no path preference, you can add general handling here if needed
      console.log("Deep Link Path:", path, "Query Params:", queryParams);
    };

    Linking.addEventListener('url', handleDeepLink);

    return () => {
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, []);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      text: "#000000", // Set the text color to black
      // Additional color properties can be defined as needed
    },
  };

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer ref={navigationRef}>
        <UserProvider>
          <Main />
        </UserProvider>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
