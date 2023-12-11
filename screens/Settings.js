import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { buttonStyle } from '../styles/Buttons';
import { textStyle } from '../styles/Text';
import { colors } from '../styles/Colors'; 
import { inputStyle } from '../styles/Inputs'; 


const Settings = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

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

  const addCategory = () => {
    const categoryToAdd = { label: newCategory, value: categories.length + 1};
    saveCategories(categoryToAdd);
  };

  const clearCategories = () => {
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
          keyExtractor={(item) => item.value.toString()}
        />

        <View style={{ paddingTop: 10 }}></View>

        <TouchableOpacity onPress={clearCategories} style={buttonStyle.buttonDelete} >
          <Text style={textStyle.textButton}>DELETE ALL DATA</Text>
        </TouchableOpacity>

        <View style={{ paddingTop: 100 }}></View>
    </View>
  );
};

export default Settings;