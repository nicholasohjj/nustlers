import Main from './src/Main';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
      <Main />
    </NavigationContainer>
    </PaperProvider>

    );
}

export default App
