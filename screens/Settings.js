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
    // Lade gespeicherte Kategorien beim Start der App
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {

      const storedCategories = await AsyncStorage.getItem('categories');
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const saveCategories = async (categoriesToSave) => {
    try {
        // Speichere die aktualisierte Liste
        await AsyncStorage.setItem('categories', JSON.stringify(categoriesToSave));
        navigation.navigate('New', { refresh: true });

    } catch (error) {
      console.error('Error saving categories:', error);
    }
  };

  const addCategory = () => {
    if (newCategory.trim() !== '') {
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      saveCategories(updatedCategories);
      setNewCategory('');
    }
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
          renderItem={({ item }) => <Text style={textStyle.textSmall}>{item}</Text>}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={textStyle.flatListContainer}
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