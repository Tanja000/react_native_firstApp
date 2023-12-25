// App.js
import React, { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18n } from 'i18n-js';


import { translations } from './utils/localization';
import Expenses from './screens/Expenses';
import New from './screens/New';
import Report from './screens/Report';
import Settings from './screens/Settings';
import { colors } from './styles/Colors'; 


const Tab = createMaterialBottomTabNavigator();


const App = () => {
  let [locale, setLocale] = useState(Localization.locale);
  //let [locale, setLocale] = useState('de');
  const i18n = new I18n(translations);
  locale = locale.substring(0, locale.length - 3);
  i18n.locale = locale;

  getLanguage();
 

  async function getLanguage(){
    const storedLanguage = await AsyncStorage.getItem('language');
    if (storedLanguage) {
      i18n.locale = storedLanguage;
    }
  }
  


  return(
  <NavigationContainer>
    <Tab.Navigator
      barStyle={{ backgroundColor: colors.backgroundPrimary}}>
      <Tab.Screen 
        name="Expenses" 
        component={Expenses} 
        options={{
          tabBarLabel: i18n.t('expenses'),
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="currency-usd" color={color} size={26} />
           // <MaterialCommunityIcons name="currency-eur" color={color} size={26} />
          ),
        }} 
        />
      <Tab.Screen 
        name="Report" 
        component={Report} 
        options={{
          tabBarLabel: i18n.t('report'),
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-bar" color={color} size={26} />
          ),
        }}    
        />
      <Tab.Screen 
        name="New" 
        component={New} 
        options={{
          tabBarLabel: i18n.t('new'),
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="plus-circle" color={color} size={26} />
          ),
        }}  
        />
      <Tab.Screen 
        name="Settings" 
        component={Settings} 
        options={{
          tabBarLabel: i18n.t('settings'),
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="settings-helper" color={color} size={26} />
          ),
        }}  
        />
    </Tab.Navigator>
  </NavigationContainer>
  );
};

export default App;