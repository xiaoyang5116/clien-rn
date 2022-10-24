import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import { connect, action } from '../../constants';
import RootView from '../RootView';
import {
  IconData,
  openPropDetail,
} from '../games/SmallUniverseProject/UpgradePage';
import { px2pd } from '../../constants/resolution';

import { TextButton } from '../../constants/custom-ui';
import FastImage from 'react-native-fast-image';
import Toast from '../toast';


export const gongFaLayerNumber = ['一', '二', '三', '四', '五', '六'];

const location = [
  { top: '60%', left: '10%' },
  { top: '70%', left: '30%' },
  { top: '55%', left: '40%' },

  { top: '35%', left: '22%' },
  { top: '12%', left: '22%' },
  { top: '15%', left: '49%' },

  { top: '13%', left: '65%' },
  { top: '23%', left: '80%' },
  { top: '35%', left: '60%' },

  { top: '65%', left: '55%' },
];

const XiuLianGongFa = props => {
  const { gongFa, currentGongFaProgress, onClose } = props;
  const { gongFaId, name, desc } = gongFa;
  const [gongFaProgress, setGongFaProgress] = useState(currentGongFaProgress)
  const { gongFaStatus, gongFaLayer, gongFaGrade } = gongFaProgress;
  const layerConfig = gongFa.layerConfig[gongFaLayer];

  const [checkedIndex, setCheckedIndex] = useState(gongFaGrade + 1);
  const [upgradeProps, setUpgradeProps] = useState([]);

  useEffect(() => {
    if (gongFaGrade < checkedIndex) {
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
  }, [checkedIndex]);

  const xiuLian = () => {
    if (upgradeProps.every(item => (item.isOk ? true : false))) {
      props.dispatch(action('GongFaModel/xiuLianGongFa')({ gongFaId })).then(result => {
        if (result !== undefined) {
          setGongFaProgress(result)
          setCheckedIndex(result.gongFaGrade + 1)
        }
      });
    } else {
      Toast.show('条件不够');
    }
  };

  const Grade = ({ item }) => {
    if (item.grade === gongFaGrade + 1) {
      return (
        <View style={{ position: 'absolute', ...location[item.grade - 1] }}>
          <TouchableOpacity
            style={{ alignItems: 'center' }}
            onPress={() => {
              setCheckedIndex(item.grade);
            }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ opacity: item.grade === checkedIndex ? 1 : 0 }}>{item.desc}</Text>
              <Text style={{ position: "absolute", opacity: item.grade === checkedIndex ? 0 : 1 }}>当前</Text>
            </View>
            <View
              style={[
                styles.round,
                {
                  backgroundColor: item.grade <= gongFaGrade ? '#F5BA1C' : null,
                  borderColor: item.grade === checkedIndex ? "#F5BA1C" : "#000"
                },
              ]}>
              <Text>{item.title}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <View style={{ position: 'absolute', ...location[item.grade - 1] }}>
        <TouchableOpacity
          style={{ alignItems: 'center' }}
          onPress={() => {
            setCheckedIndex(item.grade);
          }}>
          <View style={{ opacity: item.grade === checkedIndex ? 1 : 0 }}>
            <Text>{item.desc}</Text>
          </View>
          <View
            style={[
              styles.round,
              {
                backgroundColor: item.grade <= gongFaGrade ? '#F5BA1C' : null,
                borderColor: item.grade === checkedIndex ? "#F5BA1C" : "#000"
              },
            ]}>
            <Text>{item.title}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const GongFaGradeDesc = () => {
    return (
      <View style={{ alignItems: 'center' }}>
        <View style={styles.gongFaGradeDesc}>
          <Text style={{ fontSize: 16, color: '#000' }}>
            <Text>{checkedIndex === gongFaGrade + 1 ? "当前" : "查看"}</Text>: {gongFaLayerNumber[gongFaLayer]}层 {checkedIndex}/{layerConfig.length}
          </Text>
          <Text style={{ fontSize: 16, color: '#000', marginTop: 8 }}>
            激活: {layerConfig[checkedIndex - 1].desc}
          </Text>
        </View>
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
    if (upgradeProps.length !== 0 && gongFaGrade < checkedIndex) {
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
                <Text
                  style={{ fontSize: 18, color: '#000', textAlign: 'center' }}>
                  {item.num}/{item.needNum}
                </Text>
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
    if (checkedIndex === gongFaGrade + 1) {
      return (
        <View style={{ alignItems: 'center', width: '100%' }}>
          <TouchableOpacity onPress={xiuLian}>
            <View style={styles.btn}>
              <Text style={{ fontSize: 18, color: '#000' }}>修炼</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    if (checkedIndex > gongFaGrade + 1) {
      return (
        <View style={{ alignItems: 'center', width: '100%' }}>
          <TouchableOpacity
            onPress={() => {
              setCheckedIndex(gongFaGrade + 1);
            }}>
            <View style={styles.btn}>
              <Text style={{ fontSize: 18, color: '#000' }}>返回当前</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    return <></>;
  };

  const Footer = () => {
    return (
      <View style={styles.footerContainer}>
        <View style={styles.footerLeft}>
          <TouchableOpacity onPress={onClose}>
            <View style={styles.btn}>
              <Text style={{ fontSize: 18, color: '#000' }}>返回</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.footerRight}>
          <TouchableOpacity onPress={onClose}>
            <View style={styles.btn}>
              <Text style={{ fontSize: 18, color: '#000' }}>下一层</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.viewContainer}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.gongFaNameContainer}>
            <Text style={styles.gongFaName}>{name}</Text>
          </View>
          {/* 功法等级 */}
          <View style={{ flex: 1 }}>
            <View style={{ width: '100%', height: 400 }}>
              {layerConfig.map((item, index) => {
                return <Grade key={item.grade} item={item} />;
              })}
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
    width: '100%',
    marginTop: 40,
    alignItems: 'center',
  },
  gongFaName: {
    fontSize: 24,
    color: '#000',
  },
  round: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 60,
    // borderColor: '#000',
  },
  gongFaGradeDesc: {
    width: 350,
    height: 85,
    backgroundColor: '#ccc',
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
