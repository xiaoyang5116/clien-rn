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
import { useRootViewAdd } from '../../utils/CustomHooks';

import AntDesign from 'react-native-vector-icons/AntDesign';
import ProgressBar from '../alchemyRoom/components/ProgressBar';
import PropGrid from '../../components/prop/PropGrid';
import { TextButton, Header3 } from '../../constants/custom-ui';
import FastImage from 'react-native-fast-image';
import LianQiRecipe from './LianQiRecipe';


// 奖励物品组件
const RewardItem = (props) => {
  return (
    <View style={{ flexDirection: 'column', margin: 8, paddingBottom: 20, justifyContent: 'center', alignItems: 'center' }}>
      <PropGrid prop={props} labelStyle={{ color: '#000' }} />
    </View>
  );
}

// 奖励显示页面
const RewardsPage = (props) => {
  const { lianQiData } = props
  const theme = React.useContext(ThemeContext)
  const childs = [];
  let key = 0;
  lianQiData.targets.forEach(e => {
    childs.push(<RewardItem key={key++} propId={e.danFangId} iconId={e.iconId} num={e.num} name={e.name} quality={e.quality} />);
  });
  return (
    <TouchableWithoutFeedback style={{ zIndex: 100 }} onPress={() => {
      props.getAward()
      props.onClose()
    }}>
      <View style={{ flex: 1, zIndex: 99, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.65)' }}>
        <View>
          <Text style={{ marginBottom: 20, color: '#ccc', fontSize: 36 }}>获得丹药</Text>
        </View>
        <ImageBackground style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#a6c2cb' }} source={theme.blockBg_5_img}>
          <FastImage style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 2 }} resizeMode='stretch' source={require('../../../assets/bg/dialog_line.png')} />
          {childs}
          <FastImage style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 2 }} resizeMode='stretch' source={require('../../../assets/bg/dialog_line.png')} />
        </ImageBackground>
        <View>
          <Text style={{ marginTop: 20, color: '#fff', fontSize: 20 }}>点击任意区域关闭</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

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
        lianQiData={lianQiData}
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
        <Header3
          title={'炼器峰'}
          fontStyle={{ color: '#000' }}
          iconColor={'#000'}
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
