import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen'; // Adjust path if necessary
import CryptoChartScreen from './coinChart';
import MonteCarloSimulation from './MonteCarloSimulation';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Cryptocurrencies' }}
        />
        <Stack.Screen name="CryptoChart" component={CryptoChartScreen} />
        <Stack.Screen name="Simulation" component={MonteCarloSimulation} />
      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default App;
