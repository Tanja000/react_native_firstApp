import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../styles/Colors'; 
import { textStyle } from '../styles/Text';

const Expenses = () => (
  <View style={{ padding: 20, backgroundColor: colors.backgroundPrimary }}>
      <View style={{ paddingTop: 20 }}></View>
 
      <Text style={textStyle.textMain}>Expenses</Text>

      <View style={{ paddingTop: 1000 }}></View>
  </View>
);

export default Expenses;
