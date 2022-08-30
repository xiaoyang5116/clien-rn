import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import React from 'react'

import { action, connect, ThemeContext } from '../../../constants';

import PropGrid from '../../../components/prop/PropGrid';
import FastImage from 'react-native-fast-image';


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
  const { recipe, getAward, onClose, title } = props
  const theme = React.useContext(ThemeContext)
  const childs = [];
  let key = 0;
  recipe.targets.forEach(e => {
    childs.push(<RewardItem key={key++} propId={e.id} iconId={e.iconId} num={e.num} name={e.name} quality={e.quality} />);
  });
  return (
    <TouchableWithoutFeedback style={{ zIndex: 100 }} onPress={() => {
      getAward()
      onClose()
    }}>
      <View style={{ flex: 1, zIndex: 99, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.65)' }}>
        <View>
          <Text style={{ marginBottom: 20, color: '#ccc', fontSize: 36 }}>{title}</Text>
        </View>
        <ImageBackground style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#a6c2cb' }} source={theme.blockBg_5_img}>
          <FastImage style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 2 }} resizeMode='stretch' source={require('../../../../assets/bg/dialog_line.png')} />
          {childs}
          <FastImage style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 2 }} resizeMode='stretch' source={require('../../../../assets/bg/dialog_line.png')} />
        </ImageBackground>
        <View>
          <Text style={{ marginTop: 20, color: '#fff', fontSize: 20 }}>点击任意区域关闭</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default RewardsPage

const styles = StyleSheet.create({})