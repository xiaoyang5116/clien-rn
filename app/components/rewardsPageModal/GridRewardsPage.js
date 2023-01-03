import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native'
import React, { useEffect, useState } from 'react'

import { action, connect, ThemeContext } from '../../constants'
import FastImage from 'react-native-fast-image'
import PropGrid from '../../components/prop/PropGrid';

const RewardItem = (props) => {
  return (
    <View style={{ flexDirection: 'column', margin: 8, paddingBottom: 20, justifyContent: 'center', alignItems: 'center' }}>
      <PropGrid prop={props} labelStyle={{ color: '#000' }} />
    </View>
  );
}


// 奖励显示页面
export default GridRewardsPage = (props) => {
  const theme = React.useContext(ThemeContext)
  const childs = [];
  let key = 0;
  props.data.forEach(e => {
    childs.push(<RewardItem key={key++} propId={e.propId} iconId={e.iconId} num={e.num} name={e.name} quality={e.quality} />);
  });

  const closeHandler = () => {
    props.onClose()
  }

  return (
    <TouchableWithoutFeedback onPress={closeHandler}>
      <View style={{ flex: 1, zIndex: 99, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.65)' }}>
        <View>
          <Text style={{ marginBottom: 20, color: '#ccc', fontSize: 36 }}>获得奖励</Text>
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