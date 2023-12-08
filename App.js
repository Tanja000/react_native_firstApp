// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Expenses from './screens/Expenses';
import New from './screens/New';
import Report from './screens/Report';
import Settings from './screens/Settings';

const Tab = createMaterialBottomTabNavigator();

const App = () => (
  <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen 
        name="Expenses" 
        component={Expenses} 
        options={{
          tabBarLabel: 'Expenses',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="currency-eur" color={color} size={26} />
          ),
        }}  
        />
      <Tab.Screen 
        name="Report" 
        component={Report} 
        options={{
          tabBarLabel: 'Report',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-bar" color={color} size={26} />
          ),
        }}    
        />
      <Tab.Screen 
        name="New" 
        component={New} 
        options={{
          tabBarLabel: 'New',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="plus-circle" color={color} size={26} />
          ),
        }}  
        />
      <Tab.Screen 
        name="Settings" 
        component={Settings} 
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="settings-helper" color={color} size={26} />
          ),
        }}  
        />
    </Tab.Navigator>
  </NavigationContainer>
);

export default App;