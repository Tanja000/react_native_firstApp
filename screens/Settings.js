import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buttonStyle } from '../styles/buttons';

const Settings = () => {
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
      console.error('Fehler beim Laden der Kategorien:', error);
    }
  };

  const saveCategories = async (categoriesToSave) => {
    try {
      await AsyncStorage.setItem('categories', JSON.stringify(categoriesToSave));
    } catch (error) {
      console.error('Fehler beim Speichern der Kategorien:', error);
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
      'Daten löschen',
      'Möchtest du wirklich alle Daten löschen?',
      [
        {
          text: 'Abbrechen',
          style: 'cancel',
        },
        {
          text: 'Löschen',
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
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Kategorien</Text>

      <TextInput
        style={buttonStyle.input}
        placeholder="Neue Kategorie hinzufügen"
        value={newCategory}
        onChangeText={(text) => setNewCategory(text)}
      />
      <Button title="Hinzufügen" onPress={addCategory} style={buttonStyle.button} />

      <FlatList
        data={categories}
        renderItem={({ item }) => <Text style={{ marginTop: 10 }}>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />

      <Button title="Alle Daten löschen" onPress={clearCategories} style={buttonStyle.button} />
    </View>
  );
};

export default Settings;