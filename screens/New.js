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
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isFocus, setIsFocus] = useState(false);

  const [inputValues, setInputValues] = useState({
    category: '',
    name: '',
    description: '',
    fequency: ''
  });

  const frequencyData = [
    {label: "None", value: 1},
    {label: "daily", value: 2},
    {label: "weekly", value: 3},
    {label: "monthly", value: 4},
    {label: "yearly", value: 5}
  ];

  const handleInputChange = (field, value) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [field]: value,
    }));
  };

  const isSubmitDisabled = () => {
    // Überprüfen, ob alle Felder ausgefüllt sind
    return (
      inputValues.category === '' ||
      inputValues.name === '' ||
      inputValues.description === '' ||
      inputValues.frequency === ''
    );
  };

  const handleSubmit = async () => {
    if (
      inputValues.category === '' ||
      inputValues.name === '' ||
      inputValues.description === '' ||
      inputValues.frequency === ''
    ) {
      // Wenn nicht alle Felder ausgefüllt sind, zeige eine Meldung an
      Alert.alert('Error', 'Please fill in all fields before submitting.');
      return;
    }

    try {
      // Laden der vorhandenen Liste aus dem AsyncStorage
      const existingListString = await AsyncStorage.getItem('expensesList');
      const existingList = existingListString ? JSON.parse(existingListString) : [];

      // Hinzufügen des neuen Dictionarys zur Liste
      const newItem = { ...inputValues };
      existingList.push(newItem);

      console.log(existingList);
      // Speichern der aktualisierten Liste im AsyncStorage
      //await AsyncStorage.setItem('expensesList', JSON.stringify(existingList));

      // Benachrichtigung, dass der Vorgang erfolgreich war
      Alert.alert('Success', 'Item added to the list successfully.');

       // Zurücksetzen der TextInputs
      setInputValues({
        name: '',
        description: '',
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

  const loadList = async () => {
    try {
      const storedList = await AsyncStorage.getItem('categories');
      console.log("stored List");
      console.log(storedList);
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

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = filteredItems.filter((item) =>
      item.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredItems(filtered);
  };

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
          placeholder={!isFocus ? 'Select item' : '...'}
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
          placeholder={!isFocus ? 'Select item' : '...'}
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

        <TouchableOpacity onPress={handleSubmit}  style={buttonStyle.button}>
          <Text>Submit</Text>
        </TouchableOpacity>
       
      
    </View>
  );
};

export default New;
