import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-searchable-dropdown-kj';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { colors } from '../styles/Colors'; 
import { textStyle } from '../styles/Text';
import { buttonStyle } from '../styles/Buttons';



const New = () => {
  const [value, setValue] = useState("Select option...");
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: colors.colorDelete }]}>
          Select Category
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

      <View style={{ paddingTop: 20 }}></View>


      <View style={styles.container}>
        {renderLabel()}
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: colors.colorDelete }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
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
            setValue(item.value);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? colors.backgroundThird : colors.colorDelete}
              name="Safety"
              size={20}
            />
          )}
        />
      </View>
       
      
    </View>
  );
};

export default New;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
