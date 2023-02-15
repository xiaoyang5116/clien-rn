import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Platform,
  ImageBackground,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import { connect, action, getAchievementBadgeImage } from '../../constants';
import { ExitButton, ImageBtn, TextButton } from '../../constants/custom-ui';
import FastImage from 'react-native-fast-image';
import RootView from '../RootView';
import AchievementDetail from './AchievementDetail';
import { px2pd } from '../../constants/resolution';


const AchievementComponent = props => {
  const { data, } = props;

  const openAchievementDetail = (item) => {
    const key = RootView.add(
      <AchievementDetail
        item={item}
        onClose={() => { RootView.remove(key) }}
      />
    )
  }

  const _renderItem = ({ item }) => {
    const { badgeId, title, desc } = item;
    const img = getAchievementBadgeImage(badgeId);

    return (
      <TouchableOpacity
        style={{ width: '50%', marginBottom: 12, justifyContent: 'center', alignItems: 'center' }}
        onPress={() => { openAchievementDetail(item) }}
      >
        <ImageBackground
          style={{ width: px2pd(502), height: px2pd(218), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
          source={require('../../../assets/achievement/border.png')}
        >
          <FastImage style={{ width: px2pd(166), height: px2pd(196) }} source={img} />
          <View style={{ width: px2pd(280) }}>
            <View style={styles.titleContainer}>
              <Text style={{ fontSize: 16, color: '#e6d5be' }}>{title}</Text>
            </View>
            <View style={styles.descContainer}>
              <Text style={{ fontSize: 14, color: '#d8d8d8' }}>{desc}</Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <FlatList data={data} renderItem={_renderItem} numColumns={2} />
    </View>
  );
};

const Footer = ({ setSwitchIndex, onClose, switchIndex }) => {
  return (
    <View style={styles.footerContainer}>
      <View>
        <ExitButton onPress={onClose} />
      </View>
      <View style={styles.footerContainer}>
        <ImageBtn
          imgStyle={{ width: px2pd(353), height: px2pd(184) }}
          onPress={() => { setSwitchIndex('通常'); }}
          disabled={switchIndex === "通常" ? true : false}
          source={switchIndex === "通常" ? require('../../../assets/achievement/pt_2.png') : require('../../../assets/achievement/pt_1.png')}
          selectedSource={require('../../../assets/achievement/pt_2.png')}
        />
        <View style={{ marginLeft: 12 }}>
          <ImageBtn
            imgStyle={{ width: px2pd(350), height: px2pd(184) }}
            onPress={() => { setSwitchIndex('稀有'); }}
            disabled={switchIndex === "稀有" ? true : false}
            source={switchIndex === "稀有" ? require('../../../assets/achievement/xy_2.png') : require('../../../assets/achievement/xy_1.png')}
            selectedSource={require('../../../assets/achievement/xy_2.png')}
          />
        </View>

      </View>
    </View>
  );
};

const AchievementPage = props => {
  const { onClose, achievementData } = props;
  const [switchIndex, setSwitchIndex] = useState('通常');
  const data = achievementData.filter(item => item.type === switchIndex)

  return (
    <View style={styles.viewContainer}>
      <FastImage style={{ position: "absolute", width: "100%", height: "100%" }} source={require('../../../assets/achievement/bg.png')} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <FastImage style={{ width: px2pd(1061), height: px2pd(247) }} source={require('../../../assets/achievement/title_img.png')} />
          <AchievementComponent data={data} />
          <Footer setSwitchIndex={setSwitchIndex} onClose={onClose} switchIndex={switchIndex} />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default connect(state => ({ ...state.AchievementModel }))(AchievementPage);

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    zIndex: 99,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: Platform.OS === "android" ? 12 : 0
  },
  titleContainer: {
    backgroundColor: '#000',
    width: '100%',
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2
  },
  descContainer: {
    width: '100%',
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
