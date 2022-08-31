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
import React, { useEffect } from 'react';

import { action, connect, ThemeContext } from '../../constants';
import RootView from '../RootView';
import { now } from '../../utils/DateTimeUtils';
import { px2pd } from '../../constants/resolution';

import DanFangPage from './DanFangPage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ProgressBar from './components/ProgressBar';
import PropGrid from '../../components/prop/PropGrid';
import { TextButton, Header3 } from '../../constants/custom-ui';
import FastImage from 'react-native-fast-image';
import RewardsPage from './components/RewardsPage';

const AlchemyRoom = props => {
  const { alchemyData } = props;

  const openDanFangPage = () => {
    const key = RootView.add(
      <DanFangPage
        onClose={() => {
          RootView.remove(key);
        }}
      />,
    );
  };

  const ChooseRecipe = () => {
    return (
      <View style={{ position: 'absolute', bottom: '30%' }}>
        <TouchableOpacity onPress={openDanFangPage}>
          <Text
            style={{
              fontSize: 20,
              backgroundColor: '#319331',
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 8,
              paddingBottom: 8,
            }}>
            选择配方
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const Refining = () => {
    // {"danFangId": 1, "danFangName": "突破丹", "needTime": 100, "refiningTime": 1661481254117, "targets": [{"id": 440, "num": 1, "range": [Array], "rate": 20}]}
    // 时间差
    const diffTime = Math.floor((now() - alchemyData.refiningTime) / 1000);
    // 当前需要的时间
    const currentNeedTime = alchemyData.needTime - diffTime;

    const onFinish = () => {
      const key = RootView.add(
        <RewardsPage
          title={"获得丹药"}
          recipe={alchemyData}
          getAward={() => {
            props.dispatch(action('AlchemyModel/alchemyFinish')());
          }}
          onClose={() => {
            RootView.remove(key);
          }}
        />,
      );
    };

    if (currentNeedTime < 0) {
      setTimeout(() => {
        onFinish();
      }, 0);
      return <ChooseRecipe />;
    }

    return (
      <>
        <Text
          style={{ fontSize: 30, color: '#000', position: 'absolute', top: 12 }}>
          炼制中
        </Text>
        <View
          style={{
            position: 'absolute',
            bottom: '20%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{ fontSize: 24, color: '#000' }}>
            {alchemyData.recipeName}
          </Text>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <ProgressBar
              needTime={alchemyData.needTime}
              currentNeedTime={currentNeedTime}
              onFinish={onFinish}
            />
          </View>
        </View>
      </>
    );
  };

  const img = alchemyData ? require('../../../assets/bg/xianglu_open.png') : require('../../../assets/bg/xianglu_close.png')

  return (
    <View style={{ flex: 1, backgroundColor: '#ccc', zIndex: 99 }}>
      <FastImage
        style={{ position: 'absolute', width: px2pd(1080), height: px2pd(2400) }}
        source={require('../../../assets/plant/plantBg.jpg')}
      />
      <FastImage
        style={{ position: 'absolute', width: px2pd(1080), height: px2pd(2400) }}
        source={img}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <Header3
          title={'炼丹炉'}
          fontStyle={{ color: '#fff' }}
          iconColor={'#fff'}
          containerStyle={{ marginTop: 12 }}
          onClose={props.onClose}
        />
        <View
          style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          {alchemyData ? <Refining /> : <ChooseRecipe />}
          <View style={{ width: '90%', marginBottom: 20 }}>
            <TextButton onPress={props.onClose} title={'离开'} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default connect(state => ({ ...state.AlchemyModel }))(AlchemyRoom);

const styles = StyleSheet.create({});
