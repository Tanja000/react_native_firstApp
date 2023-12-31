import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, FlatList,  Modal, Alert, StyleSheet, Dimensions, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons'; 
import { ScrollView } from 'react-native-virtualized-view';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

import { translations } from '../utils/localization';
import { buttonStyle } from '../styles/Buttons';
import { textStyle } from '../styles/Text';
import { colors } from '../styles/Colors'; 
import { inputStyle } from '../styles/Inputs'; 
import { dropDownstyle } from '../styles/Dropdown';

const Settings = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState();
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currency, setCurrency] = useState('euro');
  const [currencySymbol, setCurrencySymbol] = useState('€');
  const i18n = new I18n(translations);

  let [locale, setLocale] = useState(Localization.locale);
  locale = locale.substring(0, locale.length - 3);
  i18n.locale = locale;

  
  // This effect will run when the screen gains focus
  useFocusEffect(
      React.useCallback(() => {
        loadCategories();
        setNewCategory('');
      }, [])
    );


    const renderFlag = () => {
      if (i18n.locale === 'en') {
        return <Image source={require('../assets/american-flag.png')} style={textStyle.flagImage} />;
      } else {
        return <Image source={require('../assets/germany-flag.png')} style={textStyle.flagImage} />;
      }
    };
  
    const renderCurrencySymbol = () => {
      return currencySymbol;
    };

    const handleLanguageChange = (itemValue) => {
      //i18n.locale = itemValue;
      if(itemValue === "de"){
        setLocale("de-DE");
      }
      else if(itemValue === "en"){
        setLocale("en-EN");
      }
      saveLanguageToStorage(itemValue);
    };
  
    const handleCurrencyChange = (itemValue) => {
      setCurrency(itemValue);
      updateCurrencySymbol(itemValue);
      saveCurrencyToStorage(itemValue);
    };

    const updateCurrencySymbol = (selectedCurrency) => {
      if (selectedCurrency === 'euro') {
        setCurrencySymbol('€');
      } else {
        setCurrencySymbol('$');
      }
    };

    const saveCurrencyToStorage = async (selectedCurrency) => {
      try {
        await AsyncStorage.setItem('currency', selectedCurrency);
      } catch (error) {
        console.error('Fehler beim Speichern der Währung in AsyncStorage:', error);
      }
    };

    const saveLanguageToStorage = async (selectedLanguage) => {
      try {
        await AsyncStorage.setItem('language', selectedLanguage);
      } catch (error) {
        console.error('Fehler beim Speichern der Sprache in AsyncStorage:', error);
      }
    };
  


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
        //TANJA TODO: Leerzeichen beim check im value entfernen
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
        setNewCategory('');
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

  const handleDeletePress = () => {
    setModalVisible(true);
  };

  async function handleDeleteConfirmed(action){
    if (action === 'Delete All Data'){
      await AsyncStorage.removeItem('categories');
      setCategories([]);
      await AsyncStorage.removeItem('expensesList');
      await AsyncStorage.removeItem('language');
      console.log("delete all data");
    }
    else if (action === 'Delete unused Categories'){
        let storedCategories = JSON.parse(await AsyncStorage.getItem('categories')) || [];
        const storedExpenses = JSON.parse(await AsyncStorage.getItem('expensesList')) || [];
        
        const unusedCategories = storedCategories.filter(category => {
            // Prüfe, ob ein Element in storedExpenses existiert, das gleich category ist
            return !storedExpenses.some(expense => areCategoriesEqual(category, expense));
          });

        for (const currentObj of unusedCategories) {
          await deleteCategoryItem(currentObj.label);
        }
        console.log("Delete Categories");
    }
    setModalVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
  };


  return (
    <ScrollView>
      <View style={{ padding: 20, backgroundColor: colors.backgroundPrimary }}>
      <View style={{ paddingTop: 20 }}></View>
        <Text style={textStyle.textMain}>{i18n.t('categories')}</Text>
        

        <TouchableOpacity onPress={handleDeletePress} style={styles.deleteButton}>
            <MaterialIcons name="delete" size={30} color="black" />
        </TouchableOpacity>
 


        <View style={{ paddingTop: 20 }}></View>

       <TextInput
          style={ inputStyle.primary}
          placeholder={i18n.t('enter_new_categories')}
          value={newCategory}
          onChangeText={(text) => setNewCategory(text)} 
          autoFocus={true}
        />
      
        <View style={{ paddingTop: 10 }}></View>

        <TouchableOpacity onPress={addCategory} style={buttonStyle.button} >
          <Text style={textStyle.textButton}>{i18n.t('add_category')}</Text>
        </TouchableOpacity>

        <View style={{ paddingTop: 10 }}></View>

        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <Text>{` ${item.label}`}</Text>
          )}
          keyExtractor={(item) => item.label.toString()}
        />

        <View style={{ paddingTop: 200}}></View>


      
      <View style={dropDownstyle.container}>
        <Text style={textStyle.textSmall}>{i18n.t('select_language_and_currency')}</Text>
        <Picker
          selectedValue={i18n.locale}
          style={dropDownstyle.container}
          onValueChange={(itemValue) => handleLanguageChange(itemValue)}
        >
          <Picker.Item style={textStyle.textSmall} label={i18n.t('german')} value="de" />
          <Picker.Item style={textStyle.textSmall} label={i18n.t('english')} value="en" />
        </Picker>
        <Picker
          selectedValue={currency}
          style={dropDownstyle.container}
          onValueChange={(itemValue) => handleCurrencyChange(itemValue)}
        >
          <Picker.Item style={textStyle.textSmall} label="Euro" value="euro" />
          <Picker.Item style={textStyle.textSmall} label="Dollar" value="dollar" />
        </Picker>
        
        <Text style={textStyle.textSmall}>
           {renderFlag()}
            ...
           {renderCurrencySymbol()}
        </Text>
      </View>
   
     <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={inputStyle.centeredView}>
          <View style={inputStyle.primary}>

            <TouchableOpacity onPress={closeModal} style={buttonStyle.closeButton}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>

            <View style={{ paddingTop: 30 }}></View>

            <Text>{i18n.t('sure_delete')}</Text>
            
            <View style={{ paddingTop: 20 }}></View>

            <TouchableOpacity
              style={buttonStyle.button}
              onPress={() => handleDeleteConfirmed('Delete All Data')}
            >
            <Text style={textStyle.textButton}>{i18n.t('delete_all')}</Text>
            </TouchableOpacity>

            <View style={{ paddingTop: 20 }}></View>

            <TouchableOpacity
              style={buttonStyle.button}
              onPress={() => handleDeleteConfirmed('Delete unused Categories')}
            >
            <Text style={textStyle.textButton}>{i18n.t('delete_cat')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  deleteButton: {
    marginLeft: Dimensions.get("window").width * 0.8
  }
});
