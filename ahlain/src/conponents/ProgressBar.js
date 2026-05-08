import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Fonts from '../assets/Fonts/Fonts';
import {ProgressBar} from 'react-native-paper';

export default function Progress({title, activeStep, activePage}) {
  const active = activeStep + 0;
  return (
    <View>
      <Text
        style={{fontSize: 24, fontFamily: Fonts.BalooBhaijaan, color: '#000',marginBottom:10}}>
        {title}
      </Text>
      <Text style={{marginBottom: 7, color: 'gray'}}>
        {activePage}
        <Text> {}out of 5</Text>
      </Text>

      <View
        style={{
          flexDirection: 'row',
          borderRadius: 10,
        }}>
        <View style={[{width: '20%', height: 5}, active > 1]}>
          <ProgressBar
            progress={1}
            style={{borderTopLeftRadius: 5, borderBottomLeftRadius: 5}}
            color={active >= 1 ? '#0bb155' : 'gray'}
          />
        </View>

        <View style={[{width: '20%', height: 5}, active > 2]}>
          <ProgressBar
            progress={1}
            height={'100%'}
            color={active >= 2 ? '#0bb155' : 'gray'}
          />
        </View>

        <View style={[{width: '20%', height: 5}, active > 3]}>
          <ProgressBar
            progress={1}
            height={'100%'}
            color={active >= 3 ? '#0bb155' : 'gray'}
          />
        </View>

        <View style={[{width: '20%', height: 5}, active > 4]}>
          <ProgressBar
            progress={1}
            height={'100%'}
            color={active >= 4 ? '#0bb155' : 'gray'}
          />
        </View>

        <View style={[{width: '20%', height: 5}, active > 5]}>
          <ProgressBar
            style={{borderTopRightRadius: 5, borderBottomRightRadius: 5}}
            progress={1}
            height={'100%'}
            color={active >= 5 ? '#0bb155' : 'gray'}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
