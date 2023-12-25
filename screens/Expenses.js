import React, { useState} from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons'; 
import { ScrollView } from 'react-native-virtualized-view';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

import { translations } from '../utils/localization';
import { colors } from '../styles/Colors'; 
import { textStyle } from '../styles/Text';
import { dropDownstyle } from '../styles/Dropdown';

const Expenses = () => {
    const [data, setData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [currencySymbol, setCurrencySymbol] = useState('€');
    const i18n = new I18n(translations);

    let [locale, setLocale] = useState(Localization.locale);
    locale = locale.substring(0, locale.length - 3);
    i18n.locale = locale;

    // This effect will run when the screen gains focus
    useFocusEffect(
      React.useCallback(() => {
        fetchData();
        const currency = loadCurrencyFromStorage();
        updateCurrencySymbol(currency);
        getLanguage();
      }, [])
    );

    async function getLanguage(){
      const storedLanguage = await AsyncStorage.getItem('language');
      if(storedLanguage === "de"){
        setLocale("de-DE");
      }
      else if(storedLanguage === "en"){
        setLocale("en-EN");
      }
    }

    async function loadCurrencyFromStorage(){
      const storedCurrency = await AsyncStorage.getItem('currency');
      if(storedCurrency === "euro"){
        setCurrencySymbol('€');
      }
      else if(storedCurrency === "dollar"){
        setCurrencySymbol('$');
      }
    };
  
    // Hier wird das Währungssymbol basierend auf der ausgewählten Währung aktualisiert
    const updateCurrencySymbol = (selectedCurrency) => {
      if (selectedCurrency === 'euro') {
        setCurrencySymbol('€');
      } else {
        setCurrencySymbol('$');
      }
    };
  
    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('expensesList');
        if (storedData !== null) {
          const parsedData = JSON.parse(storedData);
          setData(parsedData);
          const total = parsedData.reduce((accumulator, item) => accumulator + parseFloat(item.amount), 0);
          setTotalAmount(total);
        }
        else { setData([]); }
      } catch (error) {
        console.error('Fehler beim Laden der Daten: ', error);
      }
    };
  
    const deleteItem = async (index) => {
      Alert.alert(
        i18n.t('sure_delete'),
        '',
        [
          {
            text: i18n.t('cancel'),
            style: 'cancel',
          },
          {
            text: i18n.t('delete'),
            onPress: async () => {
              deleteExpenseListItem(index);
            },
          },
        ],
        { cancelable: false }
      );
    };

    async function deleteExpenseListItem(index){
      try {
          // Remove the item from AsyncStorage
          const storedData = await AsyncStorage.getItem('expensesList');
          if (storedData !== null) {
            const parsedData = JSON.parse(storedData);
            const updatedData = parsedData.filter((item) => item.index !== index);
            await AsyncStorage.setItem('expensesList', JSON.stringify(updatedData));
            fetchData();
          }
    
          // Remove the item from state
          const newData = data.filter((item) => item.index !== index);
          setData(newData);
        } catch (error) {
          console.error('Fehler beim Löschen des Elements: ', error);
        }
      }


    return(
      <ScrollView>
      <View style={{ padding: 20, backgroundColor: colors.backgroundPrimary }}>
          <View style={{ paddingTop: 20 }}></View>
    
          <Text style={textStyle.textMain}>{i18n.t('expenses')}</Text>

          <View style={{ paddingTop: 20 }}></View>

          <View style={textStyle.textMain}>
            <Text style={textStyle.label}>{i18n.t('total_amount')}: {totalAmount} {currencySymbol}</Text>
          </View>

          <View style={{ paddingTop: 40 }}></View>

          
          <View style={dropDownstyle.containerOuter}>
          <FlatList
              data={data}
              renderItem={({ item }) => (
                <View style={dropDownstyle.container}>
                  <View style={dropDownstyle.rowContainer}>
                    <Text style={textStyle.label}>{i18n.t('name')}:</Text>
                    <Text>{` ${item.name}`}</Text>
                  </View>
                  <View style={dropDownstyle.rowContainer}>
                    <Text style={textStyle.label}>{i18n.t('amount')}:</Text>
                    <Text>{` ${item.amount}`} {currencySymbol}</Text> 
                  </View>
                  <View style={dropDownstyle.rowContainer}>
                    <Text style={textStyle.label}>{i18n.t('date')}:</Text>
                    <Text>{` ${item.date}`}</Text>
                  </View>
                  <View style={dropDownstyle.rowContainer}>
                    <Text style={textStyle.label}>{i18n.t('category')}:</Text>
                    <Text>{` ${item.category}`}</Text>
                  </View>
                  <View style={dropDownstyle.rowContainer}>
                    <Text>{` ${item.description}`}</Text>
                    <TouchableOpacity onPress={() => deleteItem(item.index)}>
                      <MaterialIcons name="delete" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
      </View>
      </ScrollView>
    )
};

export default Expenses;
