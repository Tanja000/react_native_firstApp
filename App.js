// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Expenses from './screens/Expenses';
import New from './screens/New';
import Report from './screens/Report';
import Settings from './screens/Settings';

const Tab = createBottomTabNavigator();

const App = () => (
  <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen name="Expenses" component={Expenses} />
      <Tab.Screen name="Report" component={Report} />
      <Tab.Screen name="New" component={New} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  </NavigationContainer>
);

export default App;