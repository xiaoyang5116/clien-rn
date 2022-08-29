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
import { TextButton, Header3 } from '../../constants/custom-ui';


const Recipe = (props) => {
  const { danFangList } = props;

  // useEffect(() => {
  //   props.dispatch(action('AlchemyModel/getDanFangList')());
  // }, []);

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

  const RecipeComponent = () => {
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
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, zIndex: 99 }}>
      <FastImage
        style={{ position: 'absolute', width: px2pd(1080), height: px2pd(2400) }}
        source={require('../../../assets/plant/plantBg.jpg')}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <Header3
          title={"炼器图纸"}
          onClose={props.onClose}
          containerStyle={{ marginTop: 12 }}
        />
        <RecipeComponent />
      </SafeAreaView>
    </View>
  )
}

export default Recipe

const styles = StyleSheet.create({})