import React, { useState} from 'react';
import { View, Text,  Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';

import { colors } from '../styles/Colors'; 
import { textStyle } from '../styles/Text';
import { barchartStyle } from '../styles/Barchart';

const Report = () => {
  const [data, setData] = useState([]);
  const { width: screenWidth } = Dimensions.get('window');

  // This effect will run when the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      loadDataFromAsyncStorage();
    }, [])
  );

  const loadDataFromAsyncStorage = async () => {
    try {
       const existingListString = await AsyncStorage.getItem('expensesList');

    if (existingListString) {
        const existingList = JSON.parse(existingListString);

        // Gruppiere die Daten nach Datum und summiere die Amounts pro Tag auf
        const groupedData = existingList.reduce((result, item) => {
          const date = item.date;

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

        setData(chartData);
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
        <BarChart
          data={{
            labels: data.map(item => item.date),
            datasets: [
              {
                data: data.map(item => item.amount),
              },
            ],
          }}
          width={screenWidth - 50}
          height={220}
          yAxisSuffix="€"
          chartConfig={{
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => colors.backgroundThird,
            labelColor: (opacity = 1) => colors.primaryText,
            style: {
              borderRadius: 16,
            },
            propsForBackgroundLines: {
              strokeWidth: 1,
              stroke: '#efefef',
              strokeDasharray: '0',
            },
            horizontalLinesAtIntervals: 4, // Anzahl der horizontalen Linien im Gitter
            decimalPlaces: 0, // Anzahl der Dezimalstellen auf der Y-Achse
        
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
    </View>
    
  </View>
  )
};


export default Report;


