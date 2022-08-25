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

const DanFangPage = props => {
  const { danFangList } = props;

  useEffect(() => {
    if (danFangList.length === 0) {
      props.dispatch(action('AlchemyModel/getDanFangList')());
    }
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
        // extraData={update}
        />
      </View>
    );
  };

  const Header = () => {
    return (
      <View style={{ justifyContent: 'center', marginTop: 12 }}>
        <View style={{ position: 'absolute', zIndex: 2 }}>
          <TouchableOpacity onPress={props.onClose}>
            <AntDesign name='left' color={"#fff"} size={23} style={{ marginLeft: 12, }} />
          </TouchableOpacity>
        </View>
        <Text style={{ textAlign: 'center', fontSize: 24, color: '#fff' }}>
          丹方选择
        </Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <FastImage
        style={{ position: 'absolute', width: px2pd(1080), height: px2pd(2400) }}
        source={require('../../../assets/plant/plantBg.jpg')}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <Header />
        <DanFangComponent />
      </SafeAreaView>
    </View>
  );
};

export default connect(state => ({ ...state.AlchemyModel }))(DanFangPage);

const styles = StyleSheet.create({
  danFangItemContainer: {
    height: 70,
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
  },
});
