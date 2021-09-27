import React from 'react';

// Import screens
import Start from './components/Start';
import Chat from './components/Chat';

// Import react native gesture handler
import 'react-native-gesture-handler';

// Import react navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Create navigator
const Stack = createStackNavigator();

export default class App extends React.Component {

  render() {
    return (
      <NavigationContainer>

        <Stack.Navigator initialRouteName='Start'>

          <Stack.Screen name='Start' component={Start} />
          <Stack.Screen name='Chat' component={Chat} />

        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}