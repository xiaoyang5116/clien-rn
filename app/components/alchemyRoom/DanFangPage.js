import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect } from 'react';

import { px2pd } from '../../constants/resolution';
import { action, connect } from '../../constants';
import RootView from '../RootView';

import ImageCapInset from 'react-native-image-capinsets-next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import DanFangDetailPage from './DanFangDetailPage';
import { TextButton, Header3 } from '../../constants/custom-ui';
import PropIcon from './components/PropIcon';

const DanFangPage = props => {
  const { danFangList } = props;

  useEffect(() => {
    props.dispatch(action('AlchemyModel/getDanFangList')());
  }, []);

  const openDanFangDetailPage = (item) => {
    const key = RootView.add(
      <DanFangDetailPage
        danFang={item}
        onCloseDanFangPage={props.onClose}
        onClose={() => {
          RootView.remove(key);
        }}
      />,
    );
  }

  const DanFangComponent = () => {
    const renderItem = ({ item, index }) => {
      return (
        <TouchableOpacity
          style={styles.danFangItemContainer}
          onPress={() => { openDanFangDetailPage(item) }}>
          <ImageCapInset
            style={{ width: '100%', height: '100%', position: 'absolute' }}
            source={require('../../../assets/button/40dpi_gray.png')}
            capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
          />
          <View style={styles.danFangItemContent_Container}>
            <PropIcon item={item} />
            <Text style={styles.danFangName}>{item.name}</Text>
            {!item.valid ? (
              <Text style={{ fontSize: 14, color: '#585858' }}>材料不足</Text>
            ) : (
              // <Text style={{ fontSize: 14, color: '#000' }}>可选</Text>
              <></>
            )}
          </View>
        </TouchableOpacity>
      );
    };
    return (
      <View style={{ flex: 1, paddingLeft: 12, paddingRight: 12, marginTop: 12, }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={danFangList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, zIndex: 99 }}>
      <FastImage
        style={{ position: 'absolute', width: px2pd(1080), height: px2pd(2400) }}
        source={require('../../../assets/plant/plantBg.jpg')}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <Header3
          title={"丹方选择"}
          onClose={props.onClose}
          containerStyle={{ marginTop: 12 }}
        />
        <DanFangComponent />
      </SafeAreaView>
    </View>
  );
};

export default connect(state => ({ ...state.AlchemyModel }))(DanFangPage);

const styles = StyleSheet.create({
  danFangItemContainer: {
    height: px2pd(120),
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 3,
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  danFangItemContent_Container: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    alignItems: 'center',
  },
  danFangName: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 8
  },
});
