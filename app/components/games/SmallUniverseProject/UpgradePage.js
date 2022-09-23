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
        <Text style={{ fontSize: 20, color: '#000' }}>{mainAttr.name}</Text>
      </View>
    );
  };
  const Attr = () => {
    const AttrIcon = ({ grade }) => {
      return (
        <View
          style={{
            height: 180,
            width: '45%',
            backgroundColor: '#A0A0A0',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 80,
              height: 80,
              backgroundColor: '#fff',
              borderRadius: 40,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}></View>
          <Text style={{ marginTop: 12, fontSize: 18, color: '#000' }}>
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
            }}>
            <View style={{ flexDirection: 'row', width: '50%' }}>
              <Text style={{ fontSize: 17, color: '#000' }}>{key}</Text>
              <Text style={{ fontSize: 17, color: '#000', marginLeft: 12 }}>
                +{value}
              </Text>
            </View>
            <AntDesign name="doubleright" size={24} color={'#000'} />
            <View style={{ width: '30%' }}>
              <Text style={{ fontSize: 17, color: '#6089D3', marginLeft: 12 }}>
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
      <View style={{ marginTop: 20 }}>
        {/* 属性icon 和 等级 */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <AttrIcon grade={mainAttr.grade} />
          <AntDesign name="arrowright" size={30} color={'#000'} />
          <AttrIcon grade={nextGrade} />
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
        backgroundColor: '#ccc',
        borderRadius: 5,
        paddingLeft: 12,
        paddingRight: 12,
      }}>
      <Header />
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
        {currentUpgradeProps.current.map((item, index) => {
          const { quality_style, image } = IconData(item);
          return (
            <View
              key={index}
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <FastImage
                style={{
                  width: px2pd(80),
                  height: px2pd(80),
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
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 99 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            paddingLeft: 12,
            paddingRight: 12,
            justifyContent: 'space-between',
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
    width: '100%',
    height: 40,
    backgroundColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingLeft: 12,
  },
  headerContainer: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A0A0A0',
    marginTop: 12,
    borderRadius: 8,
  },
  goBackContainer: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  viewContainer: {
    height: '100%',
    width: '100%',
  },
});
