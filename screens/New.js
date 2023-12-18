import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Dropdown } from 'react-native-searchable-dropdown-kj';
import AntDesign from 'react-native-vector-icons/AntDesign';

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

  const [inputValues, setInputValues] = useState({
    category: '',
    name: '',
    amount: '',
    description: '',
    frequency: '',
    date: ''
  });

  const frequencyData = [
    {label: "None", value: 1},
    {label: "daily", value: 2},
    {label: "weekly", value: 3},
    {label: "monthly", value: 4},
    {label: "yearly", value: 5}
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

    if(inputValues.amount === ''){
      inputValues.amount = 0;
    }
    if(inputValues.date === ''){
      inputValues.date = inputDate;
    }
    if(inputValues.frequency === ''){
      inputValues.frequency = 'None';
    }
    
    if (
      inputValues.category === '' ||
      inputValues.name === '' ||
      inputValues.description === '' ||
      inputValues.amount === ''
    ) {
      // Wenn nicht alle Felder ausgefüllt sind, zeige eine Meldung an
      Alert.alert('Error', 'Please fill in all fields before submitting.');
      return;
    }

    try {
     // await AsyncStorage.removeItem('expensesList');
      // Laden der vorhandenen Liste aus dem AsyncStorage
      const existingListString = await AsyncStorage.getItem('expensesList');
      const existingList = existingListString ? JSON.parse(existingListString) : [];

      //index hinzufügen
      inputValues.index = existingList.length + 1;
      

      // Hinzufügen des neuen Dictionarys zur Liste
      const newItem = { ...inputValues };
      existingList.push(newItem);

      console.log(existingList);

      // Speichern der aktualisierten Liste im AsyncStorage
      await AsyncStorage.setItem('expensesList', JSON.stringify(existingList));

      // Benachrichtigung, dass der Vorgang erfolgreich war
      Alert.alert('Success', 'Item added to the list successfully.');

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
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert('Error', 'Failed to save item. Please try again.');
    }
  };

  const renderLabel1 = () => {
    if (value || isFocus) {
      return (
        <Text style={[dropDownstyle.label, isFocus && { color: colors.colorDelete }]}>
          Select a Category
        </Text>
      );
    }
    return null;
  };

  const renderLabel2 = () => {
    if (value || isFocus) {
      return (
        <Text style={[dropDownstyle.label, isFocus && { color: colors.colorDelete }]}>
          Select a Frequency
        </Text>
      );
    }
    return null;
  };

  const renderLabel3 = () => {
    if (value || isFocus) {
      return (
        <Text style={[dropDownstyle.label, isFocus && { color: colors.colorDelete }]}>
          Enter a Date (DD.MM.YYYY)
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
    <View style={{ padding: 20, backgroundColor: colors.backgroundPrimary }}>

      <View style={{ paddingTop: 20 }}></View>
      
      <Text style={textStyle.textMain}>New</Text>

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
          placeholder={!isFocus ? 'Select Category' : '...'}
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

      <View style={{ paddingTop: 20 }}></View>

      <TextInput
        style={ inputStyle.primary}
        placeholder="Enter a Name"
        value={inputValues.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />
      <View style={{ paddingTop: 10 }}></View>


      <TextInput
        style={ inputStyle.primary}
        placeholder="Enter the Amount"
        keyboardType="numeric"
        value={inputValues.amount}
        onChangeText={(text) => handleInputChange('amount', text)}
      />
      <View style={{ paddingTop: 10 }}></View>  

      <TextInput
        style={ inputStyle.primary}
        placeholder="Enter a Description"
        value={inputValues.description}
        onChangeText={(text) => handleInputChange('description', text)}
      />
        <View style={{ paddingTop: 30 }}></View>

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
          placeholder={!isFocus ? 'Select Frequency' : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            handleInputChange('frequency', item.label)
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

      <View style={{ paddingTop: 30 }}></View>

    
      <View>
      {renderLabel3()}
        <TextInput
          style={[inputStyle.primary, !isValid && inputStyle.invalidInput]}
          placeholder="DD.MM.YYYY"
          value={inputDate}
          onChangeText={(text) => handleInputChange('date', text)}
        />
        {!isValid && <Text style={textStyle.errorText}>Invalid date format</Text>}
      </View>  

      <View style={{ paddingTop: 20 }}></View>
       

      <TouchableOpacity onPress={handleSubmit}  style={buttonStyle.button}>
          <Text>Submit</Text>
       </TouchableOpacity>
      
    </View>
  );
};

export default New;
