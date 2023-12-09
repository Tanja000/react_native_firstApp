import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectList } from 'react-native-dropdown-select-list'


import { colors } from '../styles/Colors'; 
import { textStyle } from '../styles/Text';

let data = [];

const New = () => {
  const [selected, setSelected] = React.useState("");
  let storedCategories;
 

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const storedCategoriesString = await AsyncStorage.getItem('categories');
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
    <View style={styles.container}>
      <Text style={styles.label}>Choose a Category:</Text>
      <SelectList 
        setSelected={(val) => setSelected(val)} 
        data={data} 
        save="value"
    />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  selectedCategoryText: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default New;