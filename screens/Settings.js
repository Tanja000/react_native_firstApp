import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { buttonStyle } from '../styles/Buttons';
import { textStyle } from '../styles/Text';
import { colors } from '../styles/Colors'; 
import { inputStyle } from '../styles/Inputs'; 


const Settings = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [data, setData] = useState([]);

  // This effect will run when the screen gains focus
  useFocusEffect(
      React.useCallback(() => {
        loadCategories();
       // fetchData();
      }, [])
    );

  /*  const fetchData = async () => {
      try {
    //    await AsyncStorage.removeItem('expensesList');
        const storedData = await AsyncStorage.getItem('expensesList');
        if (storedData !== null) {
          const parsedData = JSON.parse(storedData);
          setData(parsedData);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Daten: ', error);
      }
    };*/
    

  const loadCategories = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem('categories');
      if (storedCategories) {
        const categoriesArray = JSON.parse(storedCategories);
        setCategories(categoriesArray);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };


  const saveCategories = async (newCategory) => {
    try {
        // Lade vorhandene Kategorien aus dem Speicher
        const storedCategories = await AsyncStorage.getItem('categories');
        const categories = storedCategories ? JSON.parse(storedCategories) : [];
        // Überprüfe, ob der Wert in der Kategorie bereits existiert
      if(categories != null && categories.some(e => e.label == newCategory.label)) {
          // Zeige einen Alert an, wenn die Kategorie bereits existiert
          Alert.alert(
            'Error',
            'This category already exists.',
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            { cancelable: false }
          );
        } 
       else {
        const updatedCategories = [...categories, newCategory];
        setCategories(updatedCategories);
        await AsyncStorage.setItem('categories', JSON.stringify(updatedCategories));
        console.log('Category saved successfully.');
      }
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  async function addCategory(){
    const categoryToAdd = { label: newCategory};
    saveCategories(categoryToAdd);
  };


const areCategoriesEqual = (category, expense) => {
  return category.label === expense.category;
};

async function deleteCategoryItem(label){
  let storedCategories = JSON.parse(await AsyncStorage.getItem('categories')) || [];

  try {
      // Remove the item from AsyncStorage
      if (storedCategories !== null) {
        const updatedCategory = storedCategories.filter((item) => item.label !== label);
        setCategories(updatedCategory);
        await AsyncStorage.setItem('categories', JSON.stringify(updatedCategory));
         // Remove the item from state
        const newCategory = categories.filter((item) => item.label !== label);
        setData(newCategory);
        
      }
    } catch (error) {
      console.error('Fehler beim Löschen des Elements: ', error);
    }
  }


  const deleteCategories = () => {
    Alert.alert(
      'Delete Categories',
      'Are you sure you want to delete all unused categories?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {

            let storedCategories = JSON.parse(await AsyncStorage.getItem('categories')) || [];
            const storedExpenses = JSON.parse(await AsyncStorage.getItem('expensesList')) || [];
            
            const unusedCategories = storedCategories.filter(category => {
                // Prüfe, ob ein Element in storedExpenses existiert, das gleich category ist
                return !storedExpenses.some(expense => areCategoriesEqual(category, expense));
              });

            for (const currentObj of unusedCategories) {
               await deleteCategoryItem(currentObj.label);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  async function deleteAllData(label){
    Alert.alert(
      'Delete Data',
      'Are you sure you want to delete all data?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            await AsyncStorage.removeItem('categories');
            setCategories([]);
            await AsyncStorage.removeItem('expensesList');
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
      <View style={{ padding: 20, backgroundColor: colors.backgroundPrimary }}>
        <View style={{ paddingTop: 20 }}></View>
 
        <Text style={textStyle.textMain}>Categories</Text>

        <View style={{ paddingTop: 20 }}></View>

       <TextInput
          style={ inputStyle.primary}
          placeholder="Enter new category"
          value={newCategory}
          onChangeText={(text) => setNewCategory(text)}
        />
        <View style={{ paddingTop: 10 }}></View>

        <TouchableOpacity onPress={addCategory} style={buttonStyle.button} >
          <Text style={textStyle.textButton}>ADD CATEGORY</Text>
        </TouchableOpacity>

        <View style={{ paddingTop: 10 }}></View>

        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <Text>{` ${item.label}`}</Text>
          )}
          keyExtractor={(item) => item.label.toString()}
        />

        <View style={{ paddingTop: 200 }}></View>

        <TouchableOpacity onPress={deleteCategories} style={buttonStyle.buttonDelete} >
          <Text style={textStyle.textButton}>DELETE UNUSED CATEGORIES</Text>
        </TouchableOpacity>

        <View style={{ paddingTop: 10 }}></View>

        <TouchableOpacity onPress={deleteAllData} style={buttonStyle.buttonDelete} >
          <Text style={textStyle.textButton}>DELETE ALL DATA</Text>
        </TouchableOpacity>

    </View>
  );
};

export default Settings;