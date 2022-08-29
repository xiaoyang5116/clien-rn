import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import React from 'react';

import {action, connect, ThemeContext, getPropIcon} from '../../constants';
import RootView from '../RootView';
import {now} from '../../utils/DateTimeUtils';
import {useRootViewAdd} from '../../utils/CustomHooks';

import AntDesign from 'react-native-vector-icons/AntDesign';
import {TextButton, Header3} from '../../constants/custom-ui';
import FastImage from 'react-native-fast-image';
import Recipe from './Recipe';

const Refiner = props => {
  const openRecipe = () => {
    const key = RootView.add(
      <Recipe
        onClose={() => {
          RootView.remove(key);
        }}
      />,
    );
  };

  const RefinerComponent = () => {
    return (
      <View style={{position: 'absolute', bottom: '30%'}}>
        <TouchableOpacity onPress={openRecipe}>
          <Text
            style={{
              fontSize: 20,
              backgroundColor: '#319331',
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 8,
              paddingBottom: 8,
            }}>
            选择图纸
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#ccc', zIndex: 99}}>
      <SafeAreaView style={{flex: 1}}>
        <Header3
          title={'炼器峰'}
          fontStyle={{color: '#000'}}
          iconColor={'#000'}
          containerStyle={{marginTop: 12}}
          onClose={props.onClose}
        />
        <View
          style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
          <RefinerComponent />
          <View style={{width: '90%', marginBottom: 20}}>
            <TextButton onPress={props.onClose} title={'离开'} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Refiner;

const styles = StyleSheet.create({});
