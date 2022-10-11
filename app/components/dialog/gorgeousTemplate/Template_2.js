import {StyleSheet, Text, View, ImageBackground, FlatList} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {px2pd} from '../../../constants/resolution';
import {ImageButton} from '../../../constants/custom-ui';
import {getSceneTopBackgroundImage} from '../../../constants';

const Template_2 = props => {
  const {viewData, onDialogCancel, actionMethod} = props;
  const {sections, title, imgName} = viewData;

  const RenderItem = ({item}) => {
    return (
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ImageButton
          width={px2pd(969)}
          height={px2pd(118)}
          source={require('../../../../assets/button/gorgeous_1.png')}
          selectedSource={require('../../../../assets/button/gorgeous_2.png')}
          onPress={() => {
            actionMethod(item);
            onDialogCancel();
          }}
        />
        <View pointerEvents={'none'} style={{position: 'absolute'}}>
          <Text style={{fontSize: 16, color: '#000'}}>{item.title}</Text>
        </View>
      </View>
    );
  };

  const img = getSceneTopBackgroundImage(imgName);
  return (
    <View style={styles.viewContainer}>
      <ImageBackground
        source={require('../../../../assets/linshi/dialog_bg.png')}
        style={{width: px2pd(1010), height: px2pd(1460)}}>
        {/* 标题 */}
        <View style={{width: '100%', marginTop: 24, marginLeft: 24}}>
          <Text style={{fontSize: 24, color: '#000'}}>{title}</Text>
          <FastImage
            style={{width: px2pd(358), height: px2pd(35)}}
            source={require('../../../../assets/linshi/dialog_tilte_bg.png')}
          />
        </View>

        {/* 中间图片 */}
        <View style={{alignSelf: 'stretch', height: 100, marginTop: 10}}>
          <View
            style={{
              flex: 1,
              marginLeft: 12,
              marginRight: 12,
              borderColor: '#9D9D9D',
              borderWidth: 2,
              borderRadius: 3,
              overflow: 'hidden',
            }}>
            <FastImage
              style={{width: '100%', height: '100%'}}
              source={img.img}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* 内容 */}
        <View
          style={{
            marginTop: 10,
            width: '100%',
            height: px2pd(650),
            paddingLeft: 24,
            paddingRight: 24,
            alignItems: 'center',
          }}>
          <FastImage
            style={{
              width: px2pd(931),
              height: px2pd(650),
              position: 'absolute',
              opacity: 0.1,
            }}
            source={require('../../../../assets/linshi/dialog_mid_border.png')}
          />
          <Text style={{fontSize: 18, color: '#2F2F2F', marginTop: 10}}>
            {sections.content}
          </Text>
        </View>

        {/* 按钮 */}
        <View
          style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
          {sections.btn.map((item, index) => (
            <RenderItem key={index} item={item} />
          ))}
        </View>
      </ImageBackground>
    </View>
  );
};

export default Template_2;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
