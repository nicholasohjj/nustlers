import { React } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Map from "./map";
import LocationSearch from "./locationSearch";
const SearchStack = createNativeStackNavigator();

const Search = () => {
  return (
    <SearchStack.Navigator
      initialRouteName="Map"
      screenOptions={{
        headerShown: false // This hides the header for all screens in this stack
      }}
    >
      <SearchStack.Screen name="Map" component={Map} />
      <SearchStack.Screen name="LocationSearch" component={LocationSearch} />

    </SearchStack.Navigator>
  );
};

export default Search;
