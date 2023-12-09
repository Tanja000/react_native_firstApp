import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '../styles/Colors'; 
import { textStyle } from '../styles/Text';

const Report = () => (
  <View style={{ padding: 20, backgroundColor: colors.backgroundPrimary }}>
      <View style={{ paddingTop: 20 }}></View>
 
      <Text style={textStyle.textMain}>Report</Text>

      <View style={{ paddingTop: 1000 }}></View>
  </View>
);

export default Report;