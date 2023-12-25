import React, { useState} from 'react';
import { View, Text,  Dimensions, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import RNPickerSelect from 'react-native-picker-select';

import { translations } from '../utils/localization';
import { colors } from '../styles/Colors'; 
import { textStyle } from '../styles/Text';
import { barchartStyle } from '../styles/Barchart';
import { dropDownstyle } from '../styles/Dropdown';


const Report = () => {
  const [data, setData] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('€');
  const [selectedOption, setSelectedOption] = useState('day');
  const i18n = new I18n(translations);
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState("Select option...");

  let [locale, setLocale] = useState(Localization.locale);
  locale = locale.substring(0, locale.length - 3);
  i18n.locale = locale;

  // This effect will run when the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      loadDataFromAsyncStorage();
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

  const options = [
    { label: i18n.t('daily'), value: 'day' },
    { label: i18n.t('weekly'), value: 'week' },
    { label: i18n.t('monthly'), value: 'month' },
    { label: i18n.t('yearly'), value: 'year' },
  ];

  const handleChangeOption = (value) => {
    setSelectedOption(value);
  };

  const getDataForSelectedOption = (selectedOption) => {
    switch (selectedOption) {
      case 'day':
        return generateDataForDay();
      case 'week':
        return generateDataForWeek();
      case 'month':
        return generateDataForMonth();
      case 'year':
        return generateDataForYear();
      default:
        return data;
    }
  };

  const generateDataForDay = () => {
    // Hier implementiere die Logik für Balken pro Woche
    // Erstelle Daten für Balken pro Woche
    return {
      labels: data.map(item => item.date),
      datasets: [
        {
          data: data.map(item => item.amount),
        },
      ],
    };
  };

  
  const generateDataForWeek = () => {
    const dataWeek = getDataPerWeek();
    return {
      labels: dataWeek.map(item => item.date),
      datasets: [
        {
          data: dataWeek.map(item => item.amount),
        },
      ],
    };
  };

  const generateDataForMonth = () => {
    const dataMonth = getDataPerMonth();
    return {
      labels: dataMonth.map(item => item.date),
      datasets: [
        {
          data: dataMonth.map(item => item.amount),
        },
      ],
    };
  };

  const generateDataForYear = () => {
    const dataYear = getDataPerYear();
    return {
      labels: dataYear.map(item => item.date),
      datasets: [
        {
          data: dataYear.map(item => item.amount),
        },
      ],
    };
  };
  

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

  function getDataPerYear(){
    const yearlyList = [];
    const yearlyAmounts = {};

    data.forEach((entry) => {
      const [day, month, year] = entry.date.split('.');
      var firstDay = new Date(year, 0, 2);

     if (!yearlyAmounts[firstDay]) {
      yearlyAmounts[firstDay] = 0;
      }

      yearlyAmounts[firstDay] += entry.amount;
    });
  
    for (const [key, value] of Object.entries(yearlyAmounts)) {
      const yearly = {};
      var dateObject = new Date(key);
      yearly['amount'] = value;
      yearly['date'] = dateObject.getFullYear();
      yearlyList.push(yearly);
    };

    return yearlyList;

  }

  function getDataPerWeek(){
    const weeklyList = [];
    const weeklyAmounts = {};

    data.forEach((entry) => {
      const [day, month, year] = entry.date.split('.');
      // Monate im JavaScript-Date-Objekt sind 0-basiert, daher wird 1 vom Monat abgezogen
      const javascriptMonth = parseInt(month, 10) - 1;
      const date = new Date(year, javascriptMonth, day);
      const onejan = new Date(date.getFullYear(), 0, 1);
      const week = Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
      const weekStart = year + " " + i18n.t('KW') + " " + week;

      if (!weeklyAmounts[weekStart]) {
        weeklyAmounts[weekStart] = 0;
      }

      weeklyAmounts[weekStart] += entry.amount;
    });

  
    for (const [key, value] of Object.entries(weeklyAmounts)) {
      const weekly = {};
      weekly['amount'] = value;
      weekly['date'] = key;
      weeklyList.push(weekly);
    };

    return weeklyList;
  }

  function getDataPerMonth(){
    let monthlyAmounts = {};
    let monthlyList = [];

    data.forEach(function (entry) {
      const [day, month, year] = entry.date.split('.');
      // Monate im JavaScript-Date-Objekt sind 0-basiert, daher wird 1 vom Monat abgezogen
      const javascriptMonth = parseInt(month, 10) - 1;
      const date = new Date(year, javascriptMonth, day);
      var monthKey = getMonthKey(date);

      // Überprüfen, ob der Monatsschlüssel bereits im Objekt vorhanden ist
      if (!monthlyAmounts.hasOwnProperty(monthKey)) {
        monthlyAmounts[monthKey] = 0;
      }
  
      // Betrag zum entsprechenden Monat addieren
      monthlyAmounts[monthKey] += entry.amount;
    });

    for (const [key, value] of Object.entries(monthlyAmounts)) {
      const monthly = {};
      monthly['amount'] = value;
      monthly['date'] = key;
      monthlyList.push(monthly);
    };

    return monthlyList;
  }

  function getMonthKey(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // Monate sind nullbasiert, daher +1
    month = month < 10 ? '0' + month : month; // Führende Nullen hinzufügen
    return year + '-' + month;
  }

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

   const renderLabel1 = () => {
    if (value || isFocus) {
      return (
        <Text style={[dropDownstyle.label, isFocus && { color: colors.colorDelete }]}>
          {i18n.t('select_frequency')}
        </Text>
      );
    }
    return null;
  };

  const getDynamicText = () => {
    if (selectedOption === "day") {
      return i18n.t('amount_per_date');
    } 
    else if (selectedOption === "week") {
      return i18n.t('amount_per_week');
    } 
    else if (selectedOption === "month") {
      return i18n.t('amount_per_month');
    } 
    else if (selectedOption === "year") {
      return i18n.t('amount_per_year');
    } 
    
    else {
      return i18n.t('amount_per_date');
    }
  };


  return(
    <ScrollView >
    <View style={{ padding: 20, backgroundColor: colors.backgroundPrimary }}>

      <View style={{ paddingTop: 20 }}></View>
 
      <Text style={textStyle.textMain}>{i18n.t('report')}</Text>

      <View style={{ paddingTop: 40 }}></View>

      <View style={dropDownstyle.container}>
      {renderLabel1()}
      <RNPickerSelect
          items={options}
          placeholder={{}}
          onValueChange={handleChangeOption}
          value={selectedOption}
        />
      </View>
      <View style={barchartStyle.container}>

        <Text style={barchartStyle.title}> {getDynamicText()}</Text>
      
        <ScrollView horizontal={true}>
        <BarChart
            data={getDataForSelectedOption(selectedOption)}
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
  </ScrollView>
  )
};


export default Report;


