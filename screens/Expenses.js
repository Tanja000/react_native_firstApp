import React, { useState} from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons'; 

import { colors } from '../styles/Colors'; 
import { textStyle } from '../styles/Text';
import { dropDownstyle } from '../styles/Dropdown';


const Expenses = () => {
    const [data, setData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    // This effect will run when the screen gains focus
    useFocusEffect(
      React.useCallback(() => {
        fetchData();
      }, [])
    );
  
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
  
    const deleteItem = async (index, data) => {
      Alert.alert(
        'Delete Data',
        'Are you sure you want to delete this item?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
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
      <View style={{ padding: 20, backgroundColor: colors.backgroundPrimary }}>
          <View style={{ paddingTop: 20 }}></View>
    
          <Text style={textStyle.textMain}>Expenses</Text>

          <View style={{ paddingTop: 40 }}></View>

          <View style={textStyle.textMain}>
            <Text style={textStyle.label}>Total Amount: {totalAmount}</Text>
          </View>

          <View style={{ paddingTop: 40 }}></View>

          <View style={dropDownstyle.containerOuter}>
          <FlatList
              data={data}
              renderItem={({ item }) => (
                <View style={dropDownstyle.container}>
                  <View style={dropDownstyle.rowContainer}>
                    <Text style={textStyle.label}>Name:</Text>
                    <Text>{` ${item.name}`}</Text>
                    <Text style={textStyle.label}>Amount:</Text>
                    <Text>{` ${item.amount}`}</Text>
                  </View>
                  <View style={dropDownstyle.rowContainer}>
                    <Text style={textStyle.label}>Category:</Text>
                    <Text>{` ${item.category}`}</Text>
                    <Text style={textStyle.label}>Date:</Text>
                    <Text>{` ${item.date}`}</Text>
                  </View>
                  <View style={dropDownstyle.rowContainer}>
                    <Text>{` ${item.description}`}</Text>
                    <TouchableOpacity onPress={() => deleteItem(item.index)}>
                      <MaterialIcons name="delete" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.toString()}
            />
          </View>

          <View style={{ paddingTop: 1000 }}></View>
      </View>
    )
};

export default Expenses;
