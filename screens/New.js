import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Dropdown } from 'react-native-searchable-dropdown-kj';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { MaterialIcons } from '@expo/vector-icons'; 
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

import { translations } from '../utils/localization';
import { colors } from '../styles/Colors'; 
import { textStyle } from '../styles/Text';
import { buttonStyle } from '../styles/Buttons';
import { inputStyle } from '../styles/Inputs';
import { dropDownstyle } from '../styles/Dropdown';


const New = () => {
  const [value, setValue] = useState("Select option...");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [inputDate, setInputDate] = useState(formatDate(new Date()));
  const [isValid, setIsValid] = useState(true);
  const [counter, setCounter] = useState(0);
  const [amount, setAmount] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const i18n = new I18n(translations);


  let [locale, setLocale] = useState(Localization.locale);
  locale = locale.substring(0, locale.length - 3);
  if (locale !== 'de'){
    locale = 'en';
  }
  i18n.locale = locale;

    // This effect will run when the screen gains focus
    useFocusEffect(
      React.useCallback(() => {
        setLanguage();
        resetFields();
      }, [])
    );

    function resetFields(){
      const currentDate = formatDate(new Date());
      inputValues.date = currentDate;
      setInputDate(currentDate);
      setAmount(0);
       // Zurücksetzen der TextInputs
      setCounter(0);
      setValue('Select Category');
      setInputValues({
        category: '',
        name: '',
        amount: '',
        description: '',
        frequency: '',
        date: ''
      });

    }
    async function setLanguage(){
      const storedLanguage = await AsyncStorage.getItem('language');
      if(storedLanguage === "de"){
        setLocale("de-DE");
      }
      else if(storedLanguage === "en"){
        setLocale("en-EN");
      }
      else {
        setLocale("en-EN");
      }
    }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const currentDate = formatDate(date) || formatDate(new Date());
    inputValues.date = currentDate;
    setInputDate(currentDate);
    hideDatePicker();
  };


  const [inputValues, setInputValues] = useState({
    category: '',
    name: '',
    amount: '',
    description: '',
    frequency: '',
    date: ''
  });

  const frequencyData = [
    {label: i18n.t('unique'), value: 1},
    {label: i18n.t('daily'), value: 2},
    {label: i18n.t('weekly'), value: 3},
    {label: i18n.t('monthly'), value: 4},
    {label: i18n.t('yearly'), value: 5}
  ];


  const handleInputChange = (field, value) => {
    if(field === 'date'){
      validateDate(value);
      setInputDate(value); 
    }
    if(field === 'amount'){
      // Nur Zahlen zulassen
      const numericValue = value.replace(/[^0-9]/g, '');
      setAmount(numericValue);
    }
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [field]: value,
    }));
  };


  function formatDate(date){
    const day = date.getDate();
    const month = date.getMonth() + 1; // Monate werden von 0 bis 11 gezählt
    const year = date.getFullYear();

    return `${padZero(day)}.${padZero(month)}.${year}`;
  };

  function padZero(number){
    return number < 10 ? `0${number}` : `${number}`;
  };

  const validateDate = (text) => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;
    setIsValid(regex.test(text));
  };

  const handleSubmit = async () => { 

   if(inputValues.date === ''){
      inputValues.date = inputDate;
    }
    if(inputValues.frequency === ''){
      inputValues.frequency = 'Unique';
    }
    
    if (
      inputValues.category === '' ||
      inputValues.name === '' ||
      inputValues.amount === ''
    ) {
      // Wenn nicht alle Felder ausgefüllt sind, zeige eine Meldung an
      Alert.alert(i18n.t('missing_field'));
      return;
    }

    try {
     // await AsyncStorage.removeItem('expensesList');
      // Laden der vorhandenen Liste aus dem AsyncStorage
      const existingListString = await AsyncStorage.getItem('expensesList');
      const existingList = existingListString ? JSON.parse(existingListString) : [];

      if(existingListString == null || existingListString.length === 0 || existingList.length === 0){
        inputValues.index = 1;
      }
      else{
        // Annahme: Die Index-Werte sind in jedem Element des Arrays vorhanden
        const indexesAsNumbers = existingList.map(item => parseInt(item.index, 10));
        // Finde den höchsten Index
        const highestIndex = Math.max(...indexesAsNumbers);
        //index hinzufügen
        inputValues.index = highestIndex + 1;
      }

      // Hinzufügen des neuen Dictionarys zur Liste
      const newItem = { ...inputValues };
      existingList.push(newItem);

      // Speichern der aktualisierten Liste im AsyncStorage
      await AsyncStorage.setItem('expensesList', JSON.stringify(existingList));

      // Benachrichtigung, dass der Vorgang erfolgreich war
      Alert.alert(i18n.t('success'), i18n.t('success_note'));

      resetFields();

    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert('Error', 'Failed to save item. Please try again.');
    }
  };

  const renderLabel1 = () => {
    if (value || isFocus) {
      return (
        <Text style={[dropDownstyle.label, isFocus && { color: colors.colorDelete }]}>
          {i18n.t('select_category')}
        </Text>
      );
    }
    return null;
  };

  const renderLabel2 = () => {
    if (value || isFocus) {
      return (
        <Text style={[dropDownstyle.label, isFocus && { color: colors.colorDelete }]}>
          {i18n.t('select_frequency')}
        </Text>
      );
    }
    return null;
  };

  const renderLabel3 = () => {
    if (value || isFocus) {
      return (
        <Text style={[dropDownstyle.label, isFocus && { color: colors.colorDelete }]}>
          {i18n.t('enter_date')} (DD.MM.YYYY)
        </Text>
      );
    }
    return null;
  };


  const loadList = async () => {
    try {
      const storedList = await AsyncStorage.getItem('categories');
      if (storedList !== null) {
        setFilteredItems(JSON.parse(storedList));
      }
    } 
    catch (error) {
      console.error('Fehler beim Laden der Liste:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Lade die Liste aus dem AsyncStorage jedes Mal, wenn der Tab aktiviert wird
      loadList();
    }, [])
  );

  return (
    <ScrollView >
    <View style={{ padding: 20, backgroundColor: colors.backgroundPrimary }}>

      <View style={{ paddingTop: 20 }}></View>
      
      <Text style={textStyle.textMain}>{i18n.t('new')}</Text>


      <View style={{ paddingTop: 30 }}></View>


      <View style={dropDownstyle.container}>
        {renderLabel1()}
        <Dropdown
          style={[dropDownstyle.dropdown, isFocus && { borderColor: colors.colorDelete }]}
          placeholderStyle={dropDownstyle.placeholderStyle}
          selectedTextStyle={dropDownstyle.selectedTextStyle}
          inputSearchStyle={dropDownstyle.inputSearchStyle}
          iconStyle={dropDownstyle.iconStyle}
          data={filteredItems}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? i18n.t('select_category') : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            handleInputChange('category', item.label)
            setValue(item.value);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={dropDownstyle.icon}
              color={isFocus ? colors.backgroundThird : colors.colorDelete}
              name="Safety"
              size={20}
            />
          )}
        />
      </View>

      <View style={{ paddingTop: 10 }}></View>

      <TextInput
        style={ inputStyle.primary}
        placeholder={i18n.t('enter_name')}
        value={inputValues.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />
      

      <View style={{ paddingTop: 10 }}></View>


      <TextInput
        style={ inputStyle.primary}
        placeholder={i18n.t('enter_amount')}
        keyboardType="numeric"
        value={inputValues.amount}
        onChangeText={(text) => handleInputChange('amount', text)}
      />
      <View style={{ paddingTop: 30 }}></View>

      <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20}}>
      {renderLabel3()}
        <TouchableOpacity onPress={showDatePicker}>
            <MaterialIcons name="date-range" size={44} color='#1c0821' />
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </TouchableOpacity>
        <TextInput
          style={[inputStyle.primary, !isValid && inputStyle.invalidInput]}
          placeholder="DD.MM.YYYY"
          value={inputDate}
          onChangeText={(text) => handleInputChange('date', text)}
        />
        {!isValid && <Text style={textStyle.errorText}>{i18n.t('invalid_date_format')}</Text>}
      </View> 

      <View style={{ paddingTop: 10 }}></View>

      <TextInput
        style={ inputStyle.primary}
        placeholder={i18n.t('enter_description')}
        value={inputValues.description}
        onChangeText={(text) => handleInputChange('description', text)}
      />

      
   {/*     <View style={{ paddingTop: 30 }}></View>

      
       <View style={dropDownstyle.container}>
        {renderLabel2()}
        <Dropdown
          style={[dropDownstyle.dropdown, isFocus && { borderColor: colors.colorDelete }]}
          placeholderStyle={dropDownstyle.placeholderStyle}
          selectedTextStyle={dropDownstyle.selectedTextStyle}
          inputSearchStyle={dropDownstyle.inputSearchStyle}
          iconStyle={dropDownstyle.iconStyle}
          data={frequencyData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={frequencyData[0].label}

          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            handleInputChange('frequency', item.label)
            setValue(item.value);
            setIsFocus(true);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={dropDownstyle.icon}
              color={isFocus ? colors.backgroundThird : colors.colorDelete}
              name="Safety"
              size={20}
            />
          )}
        />
      </View>*/}

      <View style={{ paddingTop: 20 }}></View>
       

      <TouchableOpacity onPress={handleSubmit}  style={buttonStyle.buttonDelete}>
          <Text style={textStyle.textButton}>{i18n.t('submit')}</Text>
       </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

export default New;
