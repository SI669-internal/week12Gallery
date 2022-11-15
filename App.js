import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { rootReducer } from './data/Reducer';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ChatScreen from './screens/ChatScreen';

LogBox.ignoreLogs(['AsyncStorage']);

function App() {
  const Stack = createNativeStackNavigator();

  const store = configureStore({
    reducer: rootReducer
  });

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Login' component={LoginScreen}/>
          <Stack.Screen name='Home' component={HomeScreen}/>
          <Stack.Screen name='Chat' component={ChatScreen}/>          
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;