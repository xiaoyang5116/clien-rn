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

import { action, connect, ThemeContext, getPropIcon } from '../../constants';
import RootView from '../RootView';
import { now } from '../../utils/DateTimeUtils';
import { px2pd } from '../../constants/resolution';

import AntDesign from 'react-native-vector-icons/AntDesign';
import ProgressBar from '../alchemyRoom/components/ProgressBar';
import PropGrid from '../../components/prop/PropGrid';
import { TextButton, Header3 } from '../../constants/custom-ui';
import FastImage from 'react-native-fast-image';
import LianQiRecipe from './LianQiRecipe';
import RewardsPage from '../alchemyRoom/components/RewardsPage';


const LianQi = props => {

  const { lianQiData } = props

  const openRecipe = () => {
    const key = RootView.add(
      <LianQiRecipe
        onClose={() => {
          RootView.remove(key);
        }}
      />,
    );
  };

  const ChooseRecipe = () => {
    return (
      <View style={{ position: 'absolute', bottom: '30%' }}>
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

  const Refining = () => {
    // 时间差
    const diffTime = Math.floor((now() - lianQiData.refiningTime) / 1000)
    // 当前需要的时间
    const currentNeedTime = lianQiData.needTime - diffTime

    const onFinish = () => {
      const key = RootView.add(<RewardsPage
        title={"获得道具"}
        recipe={lianQiData}
        getAward={() => { props.dispatch(action('LianQiModel/lianQiFinish')()) }}
        onClose={() => {
          RootView.remove(key);
        }} />);
    }

    if (currentNeedTime < 0) {
      setTimeout(() => {
        onFinish()
      }, 0)
      return (
        <ChooseRecipe />
      )
    }

    return (
      <>
        <Text style={{ fontSize: 30, color: "#000", position: "absolute", top: 12 }}>炼制中</Text>
        <View style={{ position: 'absolute', bottom: '20%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, color: "#000" }}>{lianQiData.recipeName}</Text>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <ProgressBar needTime={lianQiData.needTime} currentNeedTime={currentNeedTime} onFinish={onFinish} />
          </View>
        </View>
      </>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ccc', zIndex: 99 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <FastImage
          style={{ position: 'absolute', width: px2pd(1080), height: px2pd(2400) }}
          source={require('../../../assets/plant/plantBg.jpg')}
        />
        <Header3
          title={'炼器峰'}
          fontStyle={{ color: '#fff' }}
          iconColor={'#fff'}
          containerStyle={{ marginTop: 12 }}
          onClose={props.onClose}
        />
        <View
          style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          {
            lianQiData ? <Refining /> : <ChooseRecipe />
          }
          <View style={{ width: '90%', marginBottom: 20 }}>
            <TextButton onPress={props.onClose} title={'离开'} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default connect(state => ({ ...state.LianQiModel }))(LianQi)

const styles = StyleSheet.create({});
