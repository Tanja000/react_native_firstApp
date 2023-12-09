import React, { useState} from 'react';
import { View, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectList } from 'react-native-dropdown-select-list';
import { useFocusEffect } from '@react-navigation/native';


import { colors } from '../styles/Colors'; 
import { textStyle } from '../styles/Text';

let data = [];

const New = () => {
  const [selected, setSelected] = useState("");
  let storedCategories;
 

  useFocusEffect(() => {
      loadCategories();
      console.log("wurde neu geladen");
  });

  const loadCategories = async () => {
    try {
      console.log("get categories");
      const storedCategoriesString = await AsyncStorage.getItem('categories');
      console.log(storedCategoriesString);
      storedCategories = JSON.parse(storedCategoriesString);
      if(storedCategories){
        let counter = 0;
        storedCategories.forEach((item) => {
          const keyValue = {
            key: String(counter),
            value: item
          };
          data.push(keyValue);
          counter++;
        });
      }
      else {console.log("no data")}

    } catch (error) {
      console.error('Fehler beim Laden der Kategorien:', error);
    }
  };


  return (
    <View style={{ padding: 20, backgroundColor: colors.backgroundPrimary }}>
      <View style={{ paddingTop: 20 }}></View>
      <Text style={textStyle.textMain}>New</Text>

      <View style={{ paddingTop: 20 }}></View>
      <View style={textStyle.flatListContainer}>
        <Text style={textStyle.textSmall}>Choose a Category:</Text>
        <SelectList 
          setSelected={(val) => setSelected(val)} 
          data={data} 
          save="value"
          />
      </View>
    </View>
  );
};


export default New;