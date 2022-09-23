import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Easing,
  DeviceEventEmitter,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import { connect, action, getPropIcon } from '../../../constants';
import { px2pd } from '../../../constants/resolution';
import qualityStyle from '../../../themes/qualityStyle';
import { Platform } from 'react-native';
import RootView from '../../RootView';
import Toast from '../../toast';

import { TextButton } from '../../../constants/custom-ui';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PropTips from '../../tips/PropTips';

const windowWidth = Dimensions.get('window').width;

// icon 数据
const IconData = item => {
  const quality_style = qualityStyle.styles.find(
    e => e.id == parseInt(item.quality),
  );
  const image = getPropIcon(item.iconId);
  return { quality_style, image };
};

const openPropDetail = prop => {
  const key = RootView.add(
    <PropTips
      zIndex={99}
      viewOnly={true}
      propId={prop.propId}
      onClose={() => {
        RootView.remove(key);
      }}
    />,
  );
};

// 属性详细信息
const AttrDetail = props => {
  const {
    mainAttr,
    upgradeProps,
    nextGrade,
    nextSubAttrs,
    status,
    currentKey,
    _key,
    changeIsAnimationEnd,
  } = props;
  const gradeLeft = useRef(
    new Animated.Value(_key === 0 ? 0 : _key < currentKey ? 0 : windowWidth),
  ).current;

  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <FastImage style={{ width: px2pd(708), height: px2pd(117), position: "absolute" }}
          source={require('../../../../assets/games/SmallUniverseProject/grade_title.png')} />
        <Text style={{ fontSize: 20, color: '#000' }}>{mainAttr.name}</Text>
      </View>
    );
  };
  const Attr = () => {
    const AttrIcon = ({ grade, img }) => {
      const { quality_style, image } = IconData(mainAttr);
      return (
        <View
          style={{
            height: px2pd(370),
            width: px2pd(336),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FastImage
            style={{ width: px2pd(336), height: px2pd(370), position: 'absolute' }}
            source={img}
          />
          <View
            style={{
              height: px2pd(260),
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}>
            <FastImage
              style={{
                width: px2pd(120),
                height: px2pd(120),
                borderRadius: 5,
                borderWidth: 1,
                borderColor: quality_style.borderColor,
                backgroundColor: quality_style.backgroundColor,
              }}
              source={image.img}
            />
          </View>
          <Text style={{ fontSize: 16, color: '#fff' }}>
            {grade}级
          </Text>
        </View>
      );
    };

    const subAttrsList = mainAttr.subAttrs.map((item, index) => {
      const key = item.split(',')[0];
      const value = item.split(',')[1];
      if (status !== 1) {
        const nextValue = nextSubAttrs
          .find(item => item.split(',')[0] === key)
          .split(',')[1];
        return (
          <View
            key={key}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: 30,
              alignItems: 'center',
              borderBottomColor: '#000',
              borderBottomWidth: 1,
              paddingLeft: 12,
              paddingRight: 12
            }}>
            <View style={{ flexDirection: 'row', width: '50%' }}>
              <Text style={{ fontSize: 16, color: '#000' }}>{key}</Text>
              <Text style={{ fontSize: 16, color: '#000', marginLeft: 12 }}>
                +{value}
              </Text>
            </View>
            <FastImage
              style={{ width: px2pd(49), height: px2pd(34) }}
              source={require('../../../../assets/games/SmallUniverseProject/subAttr_jiantou.png')}
            />
            <View style={{ width: '30%' }}>
              <Text style={{ fontSize: 16, color: '#6089D3', }}>
                +{nextValue}
              </Text>
            </View>
          </View>
        );
      }

      return (
        <View
          key={key}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            height: 30,
            alignItems: 'center',
            borderBottomColor: '#000',
            borderBottomWidth: 1,
          }}>
          <View style={{ flexDirection: 'row', width: '50%' }}>
            <Text style={{ fontSize: 17, color: '#000' }}>{key}</Text>
            <Text style={{ fontSize: 17, color: '#000', marginLeft: 12 }}>
              +{value}
            </Text>
          </View>
        </View>
      );
    });

    const upgradeNeedProps = mainAttr.needProps.map(item => {
      const prop = upgradeProps.find(prop => prop.key === item.split(',')[0]);
      const propNum = item.split(',')[1];
      const { quality_style, image } = IconData(prop);
      return (
        <View key={prop.key} style={{ marginLeft: 12, marginRight: 12 }}>
          <TouchableWithoutFeedback
            onPress={() => {
              openPropDetail(prop);
            }}>
            <FastImage
              style={{
                width: px2pd(140),
                height: px2pd(140),
                borderRadius: 5,
                borderWidth: 1,
                borderColor: quality_style.borderColor,
                backgroundColor: quality_style.backgroundColor,
              }}
              source={image.img}
            />
          </TouchableWithoutFeedback>
          <Text style={{ fontSize: 18, color: '#000', textAlign: 'center' }}>
            {propNum}
          </Text>
        </View>
      );
    });

    if (status === 1) {
      return (
        <View style={{ marginTop: 20 }}>
          <Header />
          {/* 属性icon 和 等级 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <AttrIcon grade={mainAttr.grade} />
          </View>
          {/* 描述 */}
          <View
            style={{
              marginTop: 12,
              borderBottomColor: '#000',
              borderBottomWidth: 1,
              height: 30,
              justifyContent: 'center',
            }}>
            <Text style={{ fontSize: 18, color: '#000' }}>{mainAttr.desc}</Text>
          </View>

          {/* 副属性列表 */}
          <View style={{ marginTop: 8 }}>{subAttrsList}</View>
          {/* 升级需求 */}
          <View>
            <View
              style={{
                width: 150,
                height: 35,
                backgroundColor: '#A0A0A0',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30,
              }}>
              <Text style={{ fontSize: 20, color: '#000' }}>升级需求</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 30,
              }}>
              <Text style={{ fontSize: 20, color: '#000' }}>
                已经达到最高等级
              </Text>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={{ alignItems: 'center' }}>
        <View style={{ width: px2pd(1001), height: px2pd(1011), alignItems: 'center', backgroundColor: '#ccc', }}>
          <FastImage
            style={{ width: px2pd(1001), height: px2pd(1011), position: 'absolute' }}
            source={require('../../../../assets/games/SmallUniverseProject/grade_attr.png')}
          />
          <Header />
          {/* 属性icon 和 等级 */}
          <View
            style={{
              width: px2pd(740),
              marginTop: px2pd(77),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <FastImage style={{ position: 'absolute', width: px2pd(283), height: px2pd(181), zIndex: 2, left: "31%" }} source={require('../../../../assets/games/SmallUniverseProject/grade_jiantou.png')} />
            <AttrIcon grade={mainAttr.grade} img={require('../../../../assets/games/SmallUniverseProject/grade_iconBorder_left.png')} />
            <AttrIcon grade={nextGrade} img={require('../../../../assets/games/SmallUniverseProject/grade_iconBorder_right.png')} />
          </View>

          {/* 描述 */}
          <View
            style={{
              width: px2pd(740),
              marginTop: 12,
              borderBottomColor: '#000',
              borderBottomWidth: 1,
              height: 30,
              justifyContent: 'center',
              paddingLeft: 12
            }}>
            <Text style={{ fontSize: 16, color: '#000' }}>{mainAttr.desc}</Text>
          </View>

          {/* 副属性列表 */}
          <View style={{ width: px2pd(740), }}>{subAttrsList}</View>
        </View>

        {/* 升级需求 */}
        <View style={{ width: px2pd(998), height: px2pd(435), marginTop: 20, backgroundColor: "#ccc" }}>
          <FastImage
            style={{ position: 'absolute', width: px2pd(998), height: px2pd(435) }}
            source={require('../../../../assets/games/SmallUniverseProject/grede_needProp_bg.png')}
          />
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 12,
          }}>
            <Text style={{ fontSize: 20, color: '#000' }}>升级需求</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 30,
            }}>
            {upgradeNeedProps}
          </View>
        </View>
      </View>
    );
  };

  const closeAnimation = () => {
    Animated.timing(gradeLeft, {
      toValue: -windowWidth,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const enterAnimation = () => {
    Animated.timing(gradeLeft, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => { changeIsAnimationEnd(true) });
  };


  if (_key < currentKey) {
    closeAnimation();
  }
  if (_key === currentKey && _key != 0) {
    enterAnimation();
  }

  return (
    <Animated.View
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: gradeLeft,
        // backgroundColor: '#ccc',
        borderRadius: 5,
        paddingLeft: 12,
        paddingRight: 12,
      }}>
      <Attr />
    </Animated.View>
  );
};

const UpgradePage = props => {
  const { mainAttr, onClose, upgradeProps, nextGrade, nextSubAttrs, status } =
    props;

  const currentMainAttr = useRef(mainAttr);
  const currentUpgradeProps = useRef(upgradeProps);
  const currentStatus = useRef(status);
  const key = useRef(0);
  const [attrData, setAttrData] = useState([
    {
      _key: key.current,
      mainAttr: currentMainAttr.current,
      upgradeProps: currentUpgradeProps.current,
      nextGrade: nextGrade,
      nextSubAttrs: nextSubAttrs,
      status: currentStatus.current,
    },
  ]);

  const isAnimationEnd = useRef(true)
  const changeIsAnimationEnd = (param) => {
    isAnimationEnd.current = param
  }

  const upgrade = () => {
    if (currentStatus.current === 0 && !isAnimationEnd.current) {
      Toast.show('升级中...');
    }

    if (currentStatus.current === 0 && isAnimationEnd.current) {
      changeIsAnimationEnd(false)
      props
        .dispatch(
          action('SmallUniverseProjectModel/UpgradeAttr')({
            mainAttr: currentMainAttr.current,
            upgradeProps: currentUpgradeProps.current,
          }),
        )
        .then(result => {
          if (result !== undefined) {
            currentMainAttr.current = result.mainAttr;
            currentUpgradeProps.current = result.upgradeProps;
            currentStatus.current = result.status;
            key.current += 1;
            setAttrData(attrData => {
              const newData = attrData.filter(
                item => item._key > key.current - 2,
              );
              return [
                ...newData,
                {
                  _key: key.current,
                  mainAttr: result.mainAttr,
                  upgradeProps: result.upgradeProps,
                  nextGrade: result.nextGrade,
                  nextSubAttrs: result.nextSubAttrs,
                  status: result.status,
                },
              ];
            });
          }
        });
    }


    if (currentStatus.current === 1) {
      Toast.show('已经达到最高等级');
    }
    if (currentStatus.current === 2) {
      Toast.show('道具不足');
    }
  };

  const UpgradePropsComponent = () => {
    return (
      <View style={styles.upgradePropsContainer}>
        <FastImage style={{
          width: px2pd(998),
          height: px2pd(127),
          position: 'absolute'
        }}
          source={require('../../../../assets/games/SmallUniverseProject/grade_header.png')}
        />
        {currentUpgradeProps.current.map((item, index) => {
          const { quality_style, image } = IconData(item);
          return (
            <View
              key={index}
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingLeft: 12 }}>
              <FastImage
                style={{
                  width: px2pd(60),
                  height: px2pd(60),
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: quality_style.borderColor,
                  backgroundColor: quality_style.backgroundColor,
                }}
                source={image.img}
              />
              <Text style={{ fontSize: 16, color: '#000', paddingLeft: 12 }}>
                {item.num}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const AttrContainer = () => {
    return (
      <View style={{ height: '80%', width: '100%' }}>
        {attrData.map(item => {
          return (
            <AttrDetail key={item._key} currentKey={key.current} {...item} changeIsAnimationEnd={changeIsAnimationEnd} />
          );
        })}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            paddingLeft: 12,
            paddingRight: 12,
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          <UpgradePropsComponent />
          <AttrContainer />
          <View style={styles.goBackContainer}>
            <TextButton title={'升级'} onPress={upgrade} />
            <TextButton title={'返回'} onPress={onClose} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default connect(state => ({ ...state.SmallUniverseProjectModel }))(
  UpgradePage,
);

const styles = StyleSheet.create({
  upgradePropsContainer: {
    marginTop: Platform.OS == 'android' ? 8 : 0,
    // 998 × 127
    width: px2pd(998),
    height: px2pd(127),
    backgroundColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingLeft: 12,
  },
  headerContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  goBackContainer: {
    marginBottom: 12,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  viewContainer: {
    height: '100%',
    width: '100%',
  },
});
