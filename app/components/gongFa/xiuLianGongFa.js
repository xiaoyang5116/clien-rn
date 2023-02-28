import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
  Animated,
  Easing,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import { connect, action } from '../../constants';
import RootView from '../RootView';
import {
  IconData,
  openPropDetail,
} from '../games/SmallUniverseProject/UpgradePage';
import { px2pd } from '../../constants/resolution';

import { ImageButton, ReturnButton, TextButton } from '../../constants/custom-ui';
import FastImage from 'react-native-fast-image';
import Toast from '../toast';

const BTN_STYLE = {
  width: px2pd(189),
  height: px2pd(168),
}

export const gongFaLayerNumber = ['一', '二', '三', '四', '五', '六'];

const layoutConfigData = [
  {
    id: 1,
    img: require('../../../assets/gongFa/xiuLian/lianXian.png'),
    location: [
      { top: '52%', left: '-6%' },
      { top: '59%', left: '20%' },
      { top: '31%', left: '38%' },

      { top: '12%', left: '40%' },
      { top: '-3%', left: '74%' },
      { top: '8%', left: '92%' },

      { top: '51%', left: '65%' },
      { top: '68%', left: '55%' },
      { top: '83%', left: '60%' },

      { top: '93%', left: '69%' },
    ]
  },
  {
    id: 2,
    img: require('../../../assets/gongFa/xiuLian/lianXian_2.png'),
    location: [
      { top: '10%', left: '-6%' },
      { top: '29%', left: '0%' },
      { top: '41%', left: '14%' },

      { top: '66%', left: '10%' },
      { top: '79%', left: '35%' },
      { top: '70%', left: '53%' },

      { top: '13%', left: '37%' },
      { top: '29%', left: '50%' },
      { top: '39%', left: '73%' },

      { top: '63%', left: '77%' },
    ]
  }
];

const XiuLianGongFa = props => {
  const { gongFa, currentGongFaProgress, onClose } = props;
  const { gongFaId, name, desc } = gongFa;
  const [gongFaProgress, setGongFaProgress] = useState(currentGongFaProgress);
  const { gongFaStatus, gongFaLayer, gongFaGrade } = gongFaProgress;

  const [currentGongFaLayer, SetCurrentGongFaLayer] = useState(
    currentGongFaProgress.gongFaLayer,
  );
  const layerConfig = gongFa.layerConfig[currentGongFaLayer];

  const layoutData = (currentGongFaLayer % 2 === 0) ? layoutConfigData[0] : layoutConfigData[1]

  const [checkedIndex, setCheckedIndex] = useState(gongFaGrade + 1);
  const [upgradeProps, setUpgradeProps] = useState([]);

  const spinValue = React.useRef(new Animated.Value(0)).current;
  const spinFunc = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1, // 最终值 为1，这里表示最大旋转 360度
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => spinFunc());
  };
  const spin = spinValue.interpolate({
    inputRange: [0, 1], //输入值
    outputRange: ['0deg', '360deg'], //输出值
  });

  useEffect(() => {
    // 获取修炼需要的道具
    if (
      gongFaGrade < checkedIndex &&
      currentGongFaLayer === gongFaLayer &&
      gongFaStatus !== 2
    ) {
      props
        .dispatch(
          action('GongFaModel/getXiuLianNeedProps')({
            needProps: layerConfig[checkedIndex - 1].needProps,
          }),
        )
        .then(result => {
          if (result !== undefined) {
            setUpgradeProps(result);
          }
        });
    }
    if (currentGongFaLayer > gongFaLayer) {
      props
        .dispatch(
          action('GongFaModel/getXiuLianNeedProps')({
            needProps: layerConfig[checkedIndex - 1].needProps,
          }),
        )
        .then(result => {
          if (result !== undefined) {
            setUpgradeProps(result);
          }
        });
    }
    if (currentGongFaLayer === gongFaLayer && gongFaGrade >= checkedIndex) {
      setUpgradeProps([]);
    }
    if (currentGongFaLayer < gongFaLayer) {
      setUpgradeProps([]);
    }
  }, [checkedIndex]);

  useEffect(() => {
    if (currentGongFaLayer === gongFaLayer) {
      setCheckedIndex(gongFaGrade + 1);
    } else {
      setCheckedIndex(1);
    }
  }, [currentGongFaLayer]);

  useEffect(() => {
    spinFunc();
  }, [])

  const xiuLian = () => {
    if (upgradeProps.every(item => (item.isOk ? true : false))) {
      props
        .dispatch(action('GongFaModel/xiuLianGongFa')({ gongFaId }))
        .then(result => {
          if (result !== undefined) {
            setGongFaProgress(result);
            SetCurrentGongFaLayer(result.gongFaLayer);
            setCheckedIndex(result.gongFaGrade + 1);
          }
        });
    } else {
      Toast.show('条件不够');
    }
  };

  const Grade = ({ item }) => {
    let imgBg = {
      source: require("../../../assets/gongFa/xiuLian/smallYuan1.png"),
      disabled: require('../../../assets/gongFa/xiuLian/smallYuan2.png'),
      rotation: require('../../../assets/gongFa/xiuLian/smallYuan3.png'),
      style: { width: px2pd(100), height: px2pd(100) },

    }
    if (item.grade === 1 || item.grade === 4 || item.grade === 8) {
      imgBg = {
        source: require("../../../assets/gongFa/xiuLian/bigYuan1.png"),
        disabled: require('../../../assets/gongFa/xiuLian/bigYuan2.png'),
        rotation: require('../../../assets/gongFa/xiuLian/bigYuan3.png'),
        style: { width: px2pd(140), height: px2pd(140) }
      }
    }
    if (gongFaStatus === 2) {
      return (
        <View style={{ position: 'absolute', ...layoutData.location[item.grade - 1] }}>
          <TouchableOpacity
            style={{ alignItems: 'center' }}
            onPress={() => {
              setCheckedIndex(item.grade);
            }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.descContainer}
                pointerEvents="none"
              >
                <Text style={{ opacity: item.grade === checkedIndex ? 1 : 0, color: "#fff", fontSize: 16 }}>
                  {item.desc}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: 'center',
                  ...imgBg.style,
                }}>
                <FastImage style={{ ...imgBg.style, position: "absolute" }} source={imgBg.source} />
                <Text style={{ color: "#fff", fontSize: 14 }}>{item.title}</Text>
                {
                  (item.grade === checkedIndex) ? (
                    <Animated.Image
                      style={{
                        ...imgBg.style,
                        position: 'absolute',
                        zIndex: 0,
                        transform: [{ rotate: spin }],
                      }}
                      source={imgBg.rotation}
                    />
                  ) : <></>
                }

              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    if (currentGongFaLayer < gongFaLayer) {
      return (
        <View style={{ position: 'absolute', ...layoutData.location[item.grade - 1] }}>
          <TouchableOpacity
            onPress={() => {
              setCheckedIndex(item.grade);
            }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.descContainer}
                pointerEvents="none"
              >
                <Text style={{ opacity: item.grade === checkedIndex ? 1 : 0, color: "#fff", fontSize: 16 }}>
                  {item.desc}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: 'center',
                  ...imgBg.style,
                }}>
                <FastImage style={{ ...imgBg.style, position: "absolute" }} source={imgBg.source} />
                <Text style={{ color: "#fff", fontSize: 14 }}>{item.title}</Text>
                {
                  (item.grade === checkedIndex) ? (
                    <Animated.Image
                      style={{
                        ...imgBg.style,
                        position: 'absolute',
                        zIndex: 0,
                        transform: [{ rotate: spin }],
                      }}
                      source={imgBg.rotation}
                    />
                  ) : <></>
                }

              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else if (currentGongFaLayer === gongFaLayer) {
      return (
        <View style={{ position: 'absolute', ...layoutData.location[item.grade - 1] }}>
          <TouchableOpacity
            onPress={() => {
              setCheckedIndex(item.grade);
            }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.descContainer}
                pointerEvents="none"
              >
                <Text style={{ opacity: item.grade === checkedIndex ? 1 : 0, color: "#fff", fontSize: 16 }}>
                  {item.desc}
                </Text>
                {item.grade === gongFaGrade + 1 && (
                  <Text
                    style={{
                      position: 'absolute',
                      opacity: item.grade !== checkedIndex ? 1 : 0,
                      color: "#fff",
                      fontSize: 16
                    }}>
                    当前
                  </Text>
                )}
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: 'center',
                  ...imgBg.style,
                }}>
                {
                  (item.grade <= gongFaGrade && currentGongFaLayer <= gongFaLayer) ? (
                    <>
                      <FastImage style={{ ...imgBg.style, position: "absolute" }} source={imgBg.source} />
                      <Text style={{ color: "#fff", fontSize: 14 }}>{item.title}</Text>
                    </>
                  ) : (
                    <>
                      <FastImage style={{ ...imgBg.style, position: "absolute" }} source={imgBg.disabled} />
                      <Text style={{ color: "#fff", fontSize: 14 }}>{item.title}</Text>
                    </>
                  )
                }
                {
                  (item.grade === checkedIndex) ? (
                    <Animated.Image
                      style={{
                        ...imgBg.style,
                        position: 'absolute',
                        zIndex: 0,
                        transform: [{ rotate: spin }],
                      }}
                      source={imgBg.rotation}
                    />
                  ) : <></>
                }

              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else if (currentGongFaLayer > gongFaLayer) {
      return (
        <View style={{ position: 'absolute', ...layoutData.location[item.grade - 1] }}>
          <TouchableOpacity
            onPress={() => {
              setCheckedIndex(item.grade);
            }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.descContainer}
                pointerEvents="none"
              >
                <Text style={{ opacity: item.grade === checkedIndex ? 1 : 0, color: "#fff", fontSize: 16 }}>
                  {item.desc}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: 'center',
                  ...imgBg.style,
                }}>
                <FastImage style={{ ...imgBg.style, position: "absolute" }} source={imgBg.disabled} />
                <Text style={{ color: "#fff", fontSize: 14 }}>{item.title}</Text>
                {
                  (item.grade === checkedIndex) ? (
                    <Animated.Image
                      style={{
                        ...imgBg.style,
                        position: 'absolute',
                        zIndex: 0,
                        transform: [{ rotate: spin }],
                      }}
                      source={imgBg.rotation}
                    />
                  ) : <></>
                }

              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    return <></>;
  };

  const GongFaGradeDesc = () => {
    return (
      <View style={{ alignItems: 'center' }}>
        <ImageBackground
          source={require('../../../assets/gongFa/xiuLian/desc_bg.png')}
          style={styles.gongFaGradeDesc}>
          {gongFaStatus == 2 ? (
            <Text style={{ fontSize: 16, color: '#082748' }}>功法圆满</Text>
          ) : (
            <>
              <Text style={{ fontSize: 18, color: '#082748' }}>
                <Text>
                  {checkedIndex === gongFaGrade + 1 &&
                    currentGongFaLayer === gongFaLayer
                    ? '当前'
                    : '查看'}
                </Text>
                : {gongFaLayerNumber[currentGongFaLayer]}层 {checkedIndex}/
                {layerConfig.length}
              </Text>
              <Text style={{ fontSize: 18, color: '#082748', marginTop: 8 }}>
                激活: {layerConfig[checkedIndex - 1].desc}
              </Text>
            </>
          )}
        </ImageBackground>
      </View>
    );
  };

  const UpgradePropsComponent = () => {
    let needProps = (
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#61D457' }}>已激活</Text>
        <Text style={{ fontSize: 16, color: '#61D457', marginTop: 4 }}>
          {layerConfig[checkedIndex - 1].desc}
        </Text>
      </View>
    );
    if (upgradeProps.length !== 0 && gongFaStatus !== 2) {
      needProps = (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {upgradeProps.map((item, index) => {
            const { quality_style, image } = IconData(item);
            return (
              <View key={index} style={{ marginLeft: 12, marginRight: 12 }}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    openPropDetail(item);
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
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
                  <FastImage style={{ position: 'absolute', width: px2pd(294), height: px2pd(60) }} source={require('../../../assets/gongFa/xiuLian/num_bg.png')} />
                  <Text
                    style={{ fontSize: 18, color: '#27ff27', textAlign: 'center' }}>
                    {item.num}/{item.needNum}
                  </Text>
                </View>

              </View>
            );
          })}
        </View>
      );
    }
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
          marginBottom: 20,
        }}>
        {needProps}
      </View>
    );
  };

  const XiuLianBtn = () => {
    if (gongFaStatus === 2) {
      return <></>;
    }
    if (
      checkedIndex === gongFaGrade + 1 &&
      gongFaLayer === currentGongFaLayer
    ) {
      return (
        <View style={{ alignItems: 'center', width: '100%' }}>
          <ImageButton
            width={px2pd(191)}
            height={px2pd(72)}
            source={require('../../../assets/gongFa/xiuLian/xiuLian_btn1.png')}
            selectedSource={require('../../../assets/gongFa/xiuLian/xiuLian_btn2.png')}
            onPress={xiuLian}
          />
        </View>
      );
    }
    if (checkedIndex > gongFaGrade + 1 && gongFaLayer === currentGongFaLayer) {
      return (
        <View style={{ alignItems: 'center', width: '100%' }}>
          <ImageButton
            width={px2pd(253)}
            height={px2pd(72)}
            source={require('../../../assets/gongFa/xiuLian/return_btn1.png')}
            selectedSource={require('../../../assets/gongFa/xiuLian/return_btn2.png')}
            onPress={() => {
              setCheckedIndex(gongFaGrade + 1);
            }}
          />
        </View>
      );
    }
    if (gongFaLayer < currentGongFaLayer) {
      return (
        <View style={{ alignItems: 'center', width: '100%' }}>
          <ImageButton
            width={px2pd(253)}
            height={px2pd(72)}
            source={require('../../../assets/gongFa/xiuLian/return_btn1.png')}
            selectedSource={require('../../../assets/gongFa/xiuLian/return_btn2.png')}
            onPress={() => {
              setCheckedIndex(gongFaGrade + 1);
              SetCurrentGongFaLayer(gongFaLayer);
            }}
          />
        </View>
      );
    }

    return <></>;
  };

  const Footer = () => {
    return (
      <View style={styles.footerContainer}>
        <View style={styles.footerLeft}>
          <ReturnButton onPress={onClose} />
        </View>
        <View style={styles.footerRight}>
          {currentGongFaLayer > 0 && (
            <ImageButton {...BTN_STYLE}
              source={require('../../../assets/gongFa/upperFloor1.png')}
              selectedSource={require('../../../assets/gongFa/upperFloor2.png')}
              onPress={() => SetCurrentGongFaLayer(currentGongFaLayer - 1)}
            />
          )}
          {currentGongFaLayer < gongFa.layerConfig.length - 1 ? (
            <ImageButton {...BTN_STYLE}
              source={require('../../../assets/gongFa/next.png')}
              selectedSource={require('../../../assets/gongFa/next2.png')}
              onPress={() => SetCurrentGongFaLayer(currentGongFaLayer + 1)}
            />
          ) : (
            <View style={{ ...BTN_STYLE }} />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.viewContainer}>
      <FastImage
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        source={require('../../../assets/gongFa/xiuLian/bg.png')}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ImageBackground
            style={styles.gongFaNameContainer}
            source={require('../../../assets/gongFa/xiuLian/title_bg.png')}>
            <Text style={styles.gongFaName}>{name}</Text>
          </ImageBackground>
          {/* 功法等级 */}
          <View style={{ flex: 1 }}>
            <View style={{ width: '100%', alignItems: 'center' }}>
              <View style={{ width: px2pd(894), height: px2pd(932), marginTop: 20, marginBottom: 20 }}>
                <FastImage
                  style={{ position: "absolute", width: px2pd(894), height: px2pd(932) }}
                  source={layoutData.img}
                />
                {layerConfig.map((item, index) => {
                  return <Grade key={item.grade} item={item} />;
                })}
              </View>
            </View>

            {/* 描述 */}
            <GongFaGradeDesc />
            {/* 升级道具 */}
            <UpgradePropsComponent />
            {/* 修炼按钮 */}
            <XiuLianBtn />
          </View>
        </View>
        <Footer />
      </SafeAreaView>
    </View>
  );
};

export default connect(state => ({ ...state.GongFaModel }))(XiuLianGongFa);

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gongFaNameContainer: {
    width: px2pd(1168),
    height: px2pd(172),
    marginTop: 12,
    alignItems: 'center',
  },
  gongFaName: {
    fontSize: 24,
    color: '#6d7789',
    marginTop: px2pd(34),
  },
  descContainer: {
    position: 'absolute',
    top: -18,
    height: 18,
    width: 150,
    justifyContent: "center",
    alignItems: 'center',
    zIndex: 3,
  },
  gongFaGradeDesc: {
    width: px2pd(1071),
    height: px2pd(288),
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    marginLeft: 18,
  },
  footerRight: {
    marginRight: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    borderWidth: 1,
    borderColor: '#000',
    paddingLeft: 8,
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 8,
  },
});
