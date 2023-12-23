import React, { useState} from 'react';
import { View, Text,  Dimensions, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';

import { colors } from '../styles/Colors'; 
import { textStyle } from '../styles/Text';
import { barchartStyle } from '../styles/Barchart';

export async function getCurrency(){
  const storedCurrency = await AsyncStorage.getItem('currency');
  if(storedCurrency === "euro"){
    return('€');
  }
  else if(storedCurrency === "dollar"){
    return('$');
  }
}

const Report = () => {
  const [data, setData] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('€');

  // This effect will run when the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      loadDataFromAsyncStorage();
      const currency = loadCurrencyFromStorage();
      updateCurrencySymbol(currency);
    }, [])
  );


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

  const loadDataFromAsyncStorage = async () => {
    try {
       const existingListString = await AsyncStorage.getItem('expensesList');

    if (existingListString) {
        const existingList = JSON.parse(existingListString);

        // Gruppiere die Daten nach Datum und summiere die Amounts pro Tag auf
        const groupedData = existingList.reduce((result, item) => {
          const dateString = item.date;
          const date = new Date(dateString.split(".").reverse().join("-"));

          if (!result[date]) {
            result[date] = 0;
          }

          result[date] += parseFloat(item.amount);

          return result;
        }, {});

        // Formatieren der Daten für die Barchart
        const chartData = Object.keys(groupedData).map(date => ({
          date,
          amount: groupedData[date],
        }));

        const sortedData = chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
        const formattedData = sortedData.map(item => {
          const formattedDate = new Date(item.date).toLocaleDateString('de-DE'); // Format 'DD.MM.YYYY'
          return { ...item, date: formattedDate };
        });

        setData(formattedData);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Daten aus AsyncStorage:', error);
    }
  };


  return(
    <View style={{ padding: 20, backgroundColor: colors.backgroundPrimary }}>

      <View style={{ paddingTop: 20 }}></View>
 
      <Text style={textStyle.textMain}>Report</Text>

      <View style={{ paddingTop: 40 }}></View>


      <View style={barchartStyle.container}>
        <Text style={barchartStyle.title}>Amount per Date</Text>
        <ScrollView horizontal={true}>
        <BarChart
          data={{
            labels: data.map(item => item.date),
            datasets: [
              {
                data: data.map(item => item.amount),
              },
            ],
          }}
          width={Dimensions.get("window").width} // from react-native
          height={Dimensions.get("window").height * 0.6}
        //  formatYLabel={() => yLabelIterator.next().value}
          verticalLabelRotation={90}
          yAxisSuffix={currencySymbol}
          chartConfig={{
            style: {
              borderRadius: 0,
              marginBottom: 30,
            },
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => colors.backgroundThird,
            labelColor: (opacity = 1) => colors.primaryText,
            propsForBackgroundLines: {
              strokeWidth: 1,
              stroke: '#efefef',
              strokeDasharray: '0',
            },
           // horizontalLinesAtIntervals: 4, // Anzahl der horizontalen Linien im Gitter
            decimalPlaces: 0, // Anzahl der Dezimalstellen auf der Y-Achse
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            marginBottom: 30,
          }}
          fromZero={true}
          showValuesOnTopOfBars={true}
        />
        </ScrollView>
    </View>
    
  </View>
  )
};


export default Report;


