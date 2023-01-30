import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Easing,
  TouchableWithoutFeedback
} from 'react-native';
import React, { useRef, useState } from 'react';

import FastImage from 'react-native-fast-image';
import { px2pd } from '../../../constants/resolution';
import { ReturnButton } from '../../button';

const icons = [
  { id: 1, img: require('../../../../assets/dialog/draw_lots/1.png'), qian: require('../../../../assets/dialog/draw_lots/big/1.png') },
  { id: 2, img: require('../../../../assets/dialog/draw_lots/2.png'), qian: require('../../../../assets/dialog/draw_lots/big/2.png') },
  { id: 3, img: require('../../../../assets/dialog/draw_lots/3.png'), qian: require('../../../../assets/dialog/draw_lots/big/3.png') },
  { id: 4, img: require('../../../../assets/dialog/draw_lots/4.png'), qian: require('../../../../assets/dialog/draw_lots/big/4.png') },
  { id: 5, img: require('../../../../assets/dialog/draw_lots/5.png'), qian: require('../../../../assets/dialog/draw_lots/big/5.png') },
];

function getIcon(id) {
  return icons.find(item => item.id === id).img;
}
function getQianImg(id) {
  return icons.find(item => item.id === id).qian;
}

const SignComponent = ({ translateX, translateY, rotate, source, style }) => {
  return (
    <Animated.Image
      style={{
        width: px2pd(170), height: px2pd(512),
        transform: [
          { translateX: translateX ? translateX : 0 },
          { translateY: translateY ? translateY : 0 },
          { rotate: rotate ? rotate : "0deg" }
        ],
        ...style
      }}
      source={source}
    />
  )
}

const DrawLotsOption = props => {
  const { actionMethod, viewData, onDialogCancel } = props;
  const { title, sections } = viewData;
  const [checkedOption, setCheckedOption] = useState(null);
  // const isShowBtn = useRef(true).current;
  const [isShowBtn, setIsShowBtn] = useState(true)

  // 筒
  const tong_animX = useRef(new Animated.Value(0)).current;
  const tong_animY = useRef(new Animated.Value(0)).current;
  let tong_index = useRef(0).current

  // 签 1
  const qian_1_X = useRef(new Animated.Value(0)).current;
  const qian_1_Y = useRef(new Animated.Value(0)).current;
  let qian_1_index = useRef(0).current
  // 签 2
  const qian_2_X = useRef(new Animated.Value(0)).current;
  const qian_2_Y = useRef(new Animated.Value(0)).current;
  let qian_2_index = useRef(0).current
  // 签 3
  const qian_3_X = useRef(new Animated.Value(0)).current;
  const qian_3_Y = useRef(new Animated.Value(0)).current;
  let qian_3_index = useRef(0).current
  // 签 4
  const qian_4_X = useRef(new Animated.Value(0)).current;
  const qian_4_Y = useRef(new Animated.Value(0)).current;
  let qian_4_index = useRef(0).current

  // 结果动画
  const resultOpacityAnim = useRef(new Animated.Value(0)).current;
  const resultScaleAnim = useRef(new Animated.Value(0)).current;

  const tongAnimation = () => {
    if (tong_index < 5) {
      const X = 6
      const Y = 18
      Animated.sequence([
        Animated.parallel([
          Animated.timing(tong_animX, { toValue: X, duration: 60, useNativeDriver: false, easing: Easing.ease }),
          Animated.timing(tong_animY, { toValue: Y, duration: 65, useNativeDriver: false, easing: Easing.ease }),
        ]),
        Animated.parallel([
          Animated.timing(tong_animX, { toValue: -X, duration: 60, useNativeDriver: false, easing: Easing.ease }),
          Animated.timing(tong_animY, { toValue: -Y, duration: 60, useNativeDriver: false, easing: Easing.ease }),
        ]),
      ]).start(tongAnimation)
      tong_index += 1
    }
    else {
      Animated.parallel([
        Animated.timing(tong_animX, { toValue: 0, duration: 50, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(tong_animY, { toValue: 0, duration: 50, useNativeDriver: false, easing: Easing.ease }),
      ]).start()

      tong_index = 0
    }
  }
  const qian_1_Animation = () => {
    if (qian_1_index < 5) {
      const X = 10
      const Y = 15
      Animated.sequence([
        Animated.parallel([
          Animated.timing(qian_1_X, { toValue: X, duration: 70, useNativeDriver: false, easing: Easing.ease }),
          Animated.timing(qian_1_Y, { toValue: Y, duration: 70, useNativeDriver: false, easing: Easing.ease }),
        ]),
        Animated.parallel([
          Animated.timing(qian_1_X, { toValue: -X, duration: 70, useNativeDriver: false, easing: Easing.ease }),
          Animated.timing(qian_1_Y, { toValue: -Y, duration: 70, useNativeDriver: false, easing: Easing.ease }),
        ]),
      ]).start(qian_1_Animation)
      qian_1_index += 1
    }
    else {
      Animated.parallel([
        Animated.timing(qian_1_X, { toValue: 0, duration: 50, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(qian_1_Y, { toValue: 0, duration: 50, useNativeDriver: false, easing: Easing.ease }),
      ]).start()

      qian_1_index = 0
    }
  }
  const qian_2_Animation = () => {
    if (qian_2_index < 4) {
      const X = 8
      const Y = 22
      Animated.sequence([
        Animated.parallel([
          Animated.timing(qian_2_X, { toValue: X, duration: 100, useNativeDriver: false, easing: Easing.ease }),
          Animated.timing(qian_2_Y, { toValue: Y, duration: 100, useNativeDriver: false, easing: Easing.ease }),
        ]),
        Animated.parallel([
          Animated.timing(qian_2_X, { toValue: -X, duration: 100, useNativeDriver: false, easing: Easing.ease }),
          Animated.timing(qian_2_Y, { toValue: -Y, duration: 100, useNativeDriver: false, easing: Easing.ease }),
        ]),
      ]).start(qian_2_Animation)
      qian_2_index += 1
    }
    else {
      Animated.parallel([
        Animated.timing(qian_2_X, { toValue: 0, duration: 50, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(qian_2_Y, { toValue: 0, duration: 50, useNativeDriver: false, easing: Easing.ease }),
      ]).start(resultFun)

      qian_2_index = 0
    }
  }
  const qian_3_Animation = () => {
    if (qian_3_index < 4) {
      const X = 16
      const Y = 20
      Animated.sequence([
        Animated.parallel([
          Animated.timing(qian_3_X, { toValue: X, duration: 80, useNativeDriver: false, easing: Easing.ease }),
          Animated.timing(qian_3_Y, { toValue: Y, duration: 90, useNativeDriver: false, easing: Easing.ease }),
        ]),
        Animated.parallel([
          Animated.timing(qian_3_X, { toValue: -X, duration: 80, useNativeDriver: false, easing: Easing.ease }),
          Animated.timing(qian_3_Y, { toValue: -Y, duration: 90, useNativeDriver: false, easing: Easing.ease }),
        ]),
      ]).start(qian_3_Animation)
      qian_3_index += 1
    }
    else {
      Animated.parallel([
        Animated.timing(qian_3_X, { toValue: 0, duration: 50, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(qian_3_Y, { toValue: 0, duration: 50, useNativeDriver: false, easing: Easing.ease }),
      ]).start()

      qian_3_index = 0
    }
  }
  const qian_4_Animation = () => {
    if (qian_4_index < 5) {
      const X = 10
      const Y = 20
      Animated.sequence([
        Animated.parallel([
          Animated.timing(qian_4_X, { toValue: X, duration: 70, useNativeDriver: false, easing: Easing.ease }),
          Animated.timing(qian_4_Y, { toValue: Y, duration: 60, useNativeDriver: false, easing: Easing.ease }),
        ]),
        Animated.parallel([
          Animated.timing(qian_4_X, { toValue: -X, duration: 70, useNativeDriver: false, easing: Easing.ease }),
          Animated.timing(qian_4_Y, { toValue: -Y, duration: 60, useNativeDriver: false, easing: Easing.ease }),
        ]),
      ]).start(qian_4_Animation)
      qian_4_index += 1
    }
    else {
      Animated.parallel([
        Animated.timing(qian_4_X, { toValue: 0, duration: 50, useNativeDriver: false, easing: Easing.ease }),
        Animated.timing(qian_4_Y, { toValue: 0, duration: 50, useNativeDriver: false, easing: Easing.ease }),
      ]).start()

      qian_4_index = 0
    }
  }

  const nextDialog = () => {
    actionMethod(checkedOption);
    onDialogCancel();
  }

  const resultFun = () => {
    const result = Math.floor(Math.random() * 100) + 1;
    const checkedItem = sections.find(item => {
      const range = item.rate.split(',');
      if (range[0] === '>') return result > Number(range[1]);
      if (range[0] === '<') return result < Number(range[1]);
      if (range[0] === '>=') return result >= Number(range[1]);
      if (range[0] === '<=') return result <= Number(range[1]);
    });

    setCheckedOption(checkedItem);
    Animated.parallel([
      Animated.timing(resultOpacityAnim, { toValue: 1, duration: 100, useNativeDriver: false, easing: Easing.ease }),
      Animated.timing(resultScaleAnim, { toValue: 2.5, duration: 100, useNativeDriver: false, easing: Easing.ease }),
    ]).start()
  };

  const handlerDrawLots = () => {
    if (checkedOption != null) return;
    setIsShowBtn(false)
    tongAnimation()
    qian_1_Animation()
    qian_2_Animation()
    qian_3_Animation()
    qian_4_Animation()
  };

  const _renderOption = ({ item, index }) => {
    const icon = getIcon(item.iconId);
    return (
      <View style={[
        styles.optionContainer,
        { opacity: checkedOption ? (item.id === checkedOption?.id ? 1 : 0.1) : 1, }
      ]}>
        <ImageBackground
          source={require('../../../../assets/dialog/draw_lots/contentBg.png')}
          style={styles.optionItem}>
          <Image
            source={icon}
            style={{
              width: px2pd(70),
              height: px2pd(130),
              position: 'absolute',
              zIndex: 2,
              left: 4,
            }}
          />
          <Text
            style={{
              fontSize: 16,
              color: '#000',
              marginLeft: 8,
            }}>
            {item.content}
          </Text>
        </ImageBackground>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      disabled={checkedOption ? false : true}
      onPress={nextDialog}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99,
        }}>
        <View
          style={{
            width: px2pd(1080),
            height: px2pd(2007),
          }}>
          {/* 背景 */}
          <FastImage
            style={{
              position: 'absolute',
              zIndex: 0,
              width: px2pd(1080),
              height: px2pd(2007),
            }}
            source={require('../../../../assets/dialog/draw_lots/bg.png')}
          />
          {/* header */}
          <FastImage
            style={{ width: px2pd(1080), height: px2pd(171) }}
            source={require('../../../../assets/dialog/draw_lots/title.png')}
          />
          <View
            style={{
              width: '100%',
              height: '40%',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop: 20,
            }}>
            {/* 筒口 */}
            <Animated.Image
              style={{
                width: px2pd(392), height: px2pd(68),
                position: "absolute",
                bottom: px2pd(340),
                transform: [{ translateX: tong_animX }, { translateY: tong_animY }],
              }}
              source={require('../../../../assets/dialog/draw_lots/kou.png')}
            />
            {/* 签1 */}
            <SignComponent
              style={{ position: "absolute", bottom: "20%", left: "30%" }}
              translateX={qian_1_X}
              translateY={qian_1_Y}
              rotate={"-10deg"}
              source={require('../../../../assets/dialog/draw_lots/big/1.png')}
            />
            {/* 签2 */}
            <SignComponent
              style={{ position: "absolute", bottom: "25%", left: "38%" }}
              translateX={qian_2_X}
              translateY={qian_2_Y}
              rotate={"-3deg"}
              source={require('../../../../assets/dialog/draw_lots/big/2.png')}
            />
            {/* 签3 */}
            <SignComponent
              style={{ position: "absolute", bottom: "22%", left: "45%" }}
              translateX={qian_3_X}
              translateY={qian_3_Y}
              rotate={"10deg"}
              source={require('../../../../assets/dialog/draw_lots/big/3.png')}
            />
            {/* 签4 */}
            <SignComponent
              style={{ position: "absolute", bottom: "15%", left: "52%" }}
              translateX={qian_4_X}
              translateY={qian_4_Y}
              rotate={"18deg"}
              source={require('../../../../assets/dialog/draw_lots/big/4.png')}
            />
            <Animated.Image
              style={{
                width: px2pd(399), height: px2pd(425),
                transform: [{ translateX: tong_animX }, { translateY: tong_animY }],
              }}
              source={require('../../../../assets/dialog/draw_lots/tong2.png')}
            />
            {/* <Animated.Image
            style={{
              width: px2pd(431), height: px2pd(676),
              transform: [{ translateX: tong_animX }, { translateY: tong_animY }],
            }}
            source={require('../../../../assets/dialog/draw_lots/tong.png')}
          /> */}
            <TouchableOpacity
              style={{ position: 'absolute', display: isShowBtn ? 'flex' : 'none', }}
              onPress={handlerDrawLots}>
              <FastImage
                style={{ width: px2pd(425), height: px2pd(427) }}
                source={require('../../../../assets/dialog/draw_lots/clickBtn.png')}
              />
            </TouchableOpacity>
            {
              checkedOption ? (
                <Animated.View style={{ position: 'absolute', alignItems: "center", opacity: resultOpacityAnim, }}>
                  <Animated.Image
                    resizeMode="cover"
                    style={{ width: px2pd(1080), height: px2pd(512), position: 'absolute', transform: [{ scale: resultScaleAnim }] }}
                    source={require('../../../../assets/dialog/draw_lots/qianBg.png')}
                  />
                  <FastImage
                    style={{ width: px2pd(170), height: px2pd(512) }}
                    source={getQianImg(checkedOption.id)}
                  />
                </Animated.View>
              )
                : null
            }
          </View>
          {/* <View style={{ marginLeft: 12, marginTop: 12 }}>
        <Text style={{ fontSize: 16, color: '#000' }}>{title}</Text>
      </View> */}
          {/* <View style={{ marginTop: 20, width: '100%', alignItems: 'center' }}>
        <TextButton title={'选择'} onPress={handlerDrawLots} />
      </View> */}
          <View style={{ width: '100%', marginTop: 20 }}>
            <FlatList
              data={sections}
              renderItem={_renderOption}
              extraData={checkedOption}
              ListFooterComponent={() => checkedOption ? (
                <View style={{ justifyContent: "center", alignItems: "center", marginTop: 12 }}>
                  <Text style={{ color: "#000", fontSize: 16 }}>点击任意处, 进入对应选项</Text>
                </View>) : <></>
              }
            />
          </View>

        </View>
        {checkedOption ? null : (
          <View style={{ position: 'absolute', left: 12, bottom: 10, }}>
            <ReturnButton onPress={onDialogCancel} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default DrawLotsOption;

const styles = StyleSheet.create({
  optionContainer: {
    width: '100%',
    height: px2pd(130),
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionItem: {
    width: px2pd(943),
    height: px2pd(101),
    paddingLeft: px2pd(100),
    flexDirection: 'row',
    alignItems: 'center',
  },
});
