import React, { useState} from 'react';
import { View, Text,  Dimensions, ScrollView, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import RNPickerSelect from 'react-native-picker-select';

import { translations } from '../utils/localization';
import { colors } from '../styles/Colors'; 
import { textStyle } from '../styles/Text';
import { barchartStyle } from '../styles/Barchart';
import { dropDownstyle } from '../styles/Dropdown';
import { buttonStyle } from '../styles/Buttons';


const Report = () => {
  const [data, setData] = useState([]);
  const [dataPie, setDataPie] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState('€');
  const [selectedOption, setSelectedOption] = useState('day');
  const i18n = new I18n(translations);
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState("Select option...");
  const [showBarChart, setShowBarChart] = useState(true);

  const toggleChart = () => {
    setShowBarChart(!showBarChart);
  };

  let [locale, setLocale] = useState(Localization.locale);
  locale = locale.substring(0, locale.length - 3);
  if (locale !== 'de'){
    locale = 'en';
  }
  i18n.locale = locale;


  // Farbpalette
const colorPalette = [
  'rgba(27, 24, 25, 0.8)',
  'rgba(94, 79, 86, 0.8)',
  'rgba(157, 135, 147, 0.8)',
  'rgba(228, 199, 214, 0.8)',
  'rgba(51, 28, 40, 0.8)',
  'rgba(108, 61, 85, 0.8)',
  'rgba(167, 95, 132, 0.8)',
  'rgba(237, 135, 188, 0.8)',
  'rgba(43, 6, 25, 0.8)',
  'rgba(116, 18, 68, 0.8)',
  'rgba(176, 18, 100, 0.8)',
  'rgba(176, 18, 100, 0.8)',
];

  // This effect will run when the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      loadDataFromAsyncStorage();
      const currency = loadCurrencyFromStorage();
      updateCurrencySymbol(currency);
      setLanguage();
    }, [])
  );

  async function loadDataFromAsyncStorage(){
    try {
       const existingListString = await AsyncStorage.getItem('expensesList');

      if (existingListString) {
        const existingList = JSON.parse(existingListString);

 
        //Histogramm
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

        ///Pie Chart
        const pieDataList = existingList.reduce((acc, item, index) => {
          const { category, amount } = item;
          const color = colorPalette[index % colorPalette.length]; // Wiederhole die Farbpalette

        
          if (!acc[category]) {
            acc[category] = { name: category, value: 0, color  };
          }
        
          acc[category].value += parseInt(amount);
        
          return acc;
        }, {});

        const pieDataTransformed = Object.values(pieDataList);

        setDataPie(pieDataTransformed);


      }
    } catch (error) {
      console.error('Fehler beim Laden der Daten aus AsyncStorage:', error);
    }
  };

  

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

  // Funktion, um den täglichen Durchschnitt zu berechnen
function calculateDailyAverage() {
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
  const average = totalAmount / data.length;
  return parseFloat(average.toFixed(2));
}

// Funktion, um den wöchentlichen Durchschnitt zu berechnen
function calculateWeeklyAverage() {
  const dataWeek = getDataPerWeek();
  const totalAmount = dataWeek.reduce((sum, item) => sum + item.amount, 0);
  const average = totalAmount / dataWeek.length;
  return parseFloat(average.toFixed(2));
}

// Funktion, um den monatlichen Durchschnitt zu berechnen
function calculateMonthlyAverage() {
  const dataMonth = getDataPerMonth();
  const totalAmount = dataMonth.reduce((sum, item) => sum + item.amount, 0);
  const average = totalAmount / dataMonth.length;
  return parseFloat(average.toFixed(2));
}

// Funktion, um den jährlichen Durchschnitt zu berechnen
function calculateYearlyAverage() {
  const dataYear = getDataPerYear();
  const totalAmount = dataYear.reduce((sum, item) => sum + item.amount, 0);
  const average = totalAmount / dataYear.length;
  return parseFloat(average.toFixed(2));
}



  const getDynamicText = () => {
    if (selectedOption === "day") {
      const average = calculateDailyAverage();
      return (i18n.t('amount_per_date') + '   ' + ' Ø: ' + average + currencySymbol);
    } 
    else if (selectedOption === "week") {
      const average = calculateWeeklyAverage();
      return (i18n.t('amount_per_week') + '   ' + ' Ø: ' + average + currencySymbol);
    } 
    else if (selectedOption === "month") {
      const average = calculateMonthlyAverage();
      return (i18n.t('amount_per_month') + '   ' + ' Ø: ' + average + currencySymbol);
    } 
    else if (selectedOption === "year") {
      const average = calculateYearlyAverage();
      return (i18n.t('amount_per_year') + '   ' + ' Ø: ' + average + currencySymbol);
    } 
    
    else {
      return i18n.t('amount_per_date');
    }
  };



  if (showBarChart) {
    return (
      <ScrollView >
      <View style={{ padding: 20, backgroundColor: colors.backgroundPrimary }}>

        <View style={{ paddingTop: 20 }}></View>
  
        <Text style={textStyle.textMain}>{i18n.t('report')}</Text>

        <View style={{ paddingTop: 40 }}></View>

        <TouchableOpacity onPress={toggleChart} style={buttonStyle.buttonDelete}>
          <Text style={textStyle.textButton}>
            {showBarChart ? i18n.t('pie_chart') : i18n.t('bar_chart')}
          </Text>
        </TouchableOpacity>

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

          {showBarChart ? (
          <BarChart
            data={getDataForSelectedOption(selectedOption)}
            width={Dimensions.get("window").width} 
            height={Dimensions.get("window").height * 0.6}
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
          ) : (
          <PieChart
            data={dataPie}
            width={300}
            height={200}
            chartConfig={{
              backgroundGradientFrom: '#1E2923',
              backgroundGradientTo: '#08130D',
              color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            }}
            coverRadius={0.45}
            coverFill={'#FFF'}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        )}

        
        </ScrollView>
      </View>

    </View>
    </ScrollView>
    )
  }

  else {
    return (
      <ScrollView >
      <View style={{ padding: 20, backgroundColor: colors.backgroundPrimary }}>

        <View style={{ paddingTop: 20 }}></View>
  
        <Text style={textStyle.textMain}>{i18n.t('report')}</Text>

        <View style={{ paddingTop: 40 }}></View>

        <TouchableOpacity onPress={toggleChart} style={buttonStyle.buttonDelete}>
          <Text style={textStyle.textButton}>
            {showBarChart ? i18n.t('pie_chart') : i18n.t('bar_chart')}
          </Text>
        </TouchableOpacity>

        <View style={{ paddingTop: 40 }}></View>
        
        <View style={barchartStyle.container}>        
          <ScrollView horizontal={true}>

          {showBarChart ? (
          <BarChart
            data={getDataForSelectedOption(selectedOption)}
            width={Dimensions.get("window").width} 
            height={Dimensions.get("window").height * 0.6}
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
          ) : (
          <PieChart
            data={dataPie}
            width={300}
            height={200}

            chartConfig={{
              backgroundGradientFrom: '#1E2923',
              backgroundGradientTo: '#08130D',
              color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            }}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        )}
        </ScrollView>
      </View>

    </View>
    </ScrollView>
    )
  }

};


export default Report;


