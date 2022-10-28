import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import { connect, action, getAchievementBadgeImage } from '../../constants';
import { TextButton } from '../../constants/custom-ui';
import FastImage from 'react-native-fast-image';
import RootView from '../RootView';
import AchievementDetail from './AchievementDetail';


const AchievementComponent = props => {
  const { data, title: titleText } = props;

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
        style={{ width: '50%', marginBottom: 12 }}
        onPress={() => { openAchievementDetail(item) }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <View>
            <FastImage style={{ width: 50, height: 50 }} source={img} />
          </View>
          <View style={{ flex: 1, paddingLeft: 12, paddingRight: 12 }}>
            <View style={styles.titleContainer}>
              <Text style={{ fontSize: 16, color: '#000' }}>{title}</Text>
            </View>
            <View style={styles.descContainer}>
              <Text style={{ fontSize: 14, color: '#707070' }}>{desc}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, paddingLeft: 12, paddingRight: 12 }}>
      <View
        style={{
          width: 140,
          height: 40,
          backgroundColor: '#BAE8FF',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{ fontSize: 20, color: '#000' }}>{titleText}</Text>
      </View>
      <View
        style={{
          width: '100%',
          height: 1,
          backgroundColor: '#ccc',
          marginTop: 12,
          marginBottom: 12,
        }}
      />
      <View style={{ flex: 1 }}>
        <FlatList data={data} renderItem={_renderItem} numColumns={2} />
      </View>
    </View>
  );
};

const Footer = ({ setSwitchIndex, onClose }) => {
  return (
    <View style={styles.footerContainer}>
      <View>
        <TextButton title={'退出'} onPress={onClose} />
      </View>
      <View style={styles.footerContainer}>
        <TextButton
          title={'通常成就'}
          onPress={() => {
            setSwitchIndex('通常成就');
          }}
        />
        <TextButton
          title={'稀有成就'}
          onPress={() => {
            setSwitchIndex('稀有成就');
          }}
          containerStyle={{ marginLeft: 12 }}
        />
      </View>
    </View>
  );
};

const AchievementPage = props => {
  const { onClose, achievementData } = props;
  const [switchIndex, setSwitchIndex] = useState('通常成就');

  if (achievementData.length === 0) {
    return (
      <View style={styles.viewContainer}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Text>还没有获得成就</Text>
          </View>
          <Footer setSwitchIndex={setSwitchIndex} onClose={onClose} />
        </SafeAreaView>
      </View>
    )
  }

  return (
    <View style={styles.viewContainer}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {switchIndex === '通常成就' && (
              <AchievementComponent
                title={'通常成就'}
                data={achievementData.filter(item => item.type == '通常')}
              />
            )}
            {switchIndex === '稀有成就' && (
              <AchievementComponent
                title={'稀有成就'}
                data={achievementData.filter(item => item.type == '稀有')}
              />
            )}
          </View>
          <Footer setSwitchIndex={setSwitchIndex} onClose={onClose} />
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
    backgroundColor: '#fff',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: Platform.OS === "android" ? 12 : 0
  },
  titleContainer: {
    backgroundColor: '#ccc',
    width: '100%',
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ABABAB',
  },
  descContainer: {
    backgroundColor: '#ccc',
    width: '100%',
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
