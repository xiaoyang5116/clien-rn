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
import LianQiRecipeDetail from './LianQiRecipeDetail';
import PropIcon from '../alchemyRoom/components/PropIcon';


const LianQiRecipe = (props) => {
  const { lianQiTuZhiList } = props;

  useEffect(() => {
    props.dispatch(action('LianQiModel/getLianQiTuZhiList')());
  }, []);

  const openlianQiDetailPage = (item) => {
    const key = RootView.add(
      <LianQiRecipeDetail
        recipe={item}
        onCloseRecipePage={props.onClose}
        onClose={() => {
          RootView.remove(key);
        }}
      />,
    );
  }

  const RecipeComponent = () => {
    const renderItem = ({ item, index }) => {
      return (
        <TouchableOpacity
          style={styles.lianQiItemContainer}
          onPress={() => { openlianQiDetailPage(item) }}>
          <ImageCapInset
            style={{ width: '100%', height: '100%', position: 'absolute' }}
            source={require('../../../assets/button/40dpi_gray.png')}
            capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
          />
          <View style={styles.lianQiItemContent_Container}>
            <PropIcon item={item} />
            <Text style={styles.lianQiName}>{item.name}</Text>
            {!item.valid ? (
              <Text style={{ fontSize: 14, color: '#585858' }}>材料不足</Text>
            ) : (
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
          data={lianQiTuZhiList}
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

export default connect(state => ({ ...state.LianQiModel }))(LianQiRecipe)

const styles = StyleSheet.create({
  lianQiItemContainer: {
    height: 45,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 3,
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  lianQiItemContent_Container: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    alignItems: 'center',
  },
  lianQiName: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    marginLeft: 8
  },
});