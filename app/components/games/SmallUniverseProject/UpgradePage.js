import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Easing,
  DeviceEventEmitter
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import { connect, action, getPropIcon } from '../../../constants';
import { px2pd } from '../../../constants/resolution';
import qualityStyle from '../../../themes/qualityStyle';
import { Platform } from 'react-native';
import RootView from '../../RootView';

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

const openPropDetail = (prop) => {
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
const AttrDetail = (props) => {
  const { mainAttr, upgradeProps, nextGrade, nextSubAttrs, status, setAttrView, currentKey, animatedLeft } = props;
  const gradeLeft = useRef(new Animated.Value(currentKey === 0 ? 0 : windowWidth)).current;

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
        <View style={{ height: 180, width: "45%", backgroundColor: "#A0A0A0", justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 80, height: 80, backgroundColor: "#fff", borderRadius: 40, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}></View>
          <Text style={{ marginTop: 12, fontSize: 18, color: "#000" }}>{grade}级</Text>
        </View>
      )
    }

    const subAttrsList = mainAttr.subAttrs.map((item, index) => {
      const key = item.split(',')[0]
      const value = item.split(',')[1]
      if (status !== 1) {
        const nextValue = nextSubAttrs.find(item => item.split(',')[0] === key).split(',')[1]
        return (
          <View key={key} style={{ flexDirection: 'row', justifyContent: "space-between", height: 30, alignItems: 'center', borderBottomColor: "#000", borderBottomWidth: 1 }}>
            <View style={{ flexDirection: 'row', width: "50%" }}>
              <Text style={{ fontSize: 17, color: "#000" }}>{key}</Text>
              <Text style={{ fontSize: 17, color: "#000", marginLeft: 12 }}>+{value}</Text>
            </View>
            <AntDesign name='doubleright' size={24} color={"#000"} />
            <View style={{ width: "30%" }}>
              <Text style={{ fontSize: 17, color: "#6089D3", marginLeft: 12 }}>+{nextValue}</Text>
            </View>
          </View>
        )
      }

      return (
        <View key={key} style={{ flexDirection: 'row', justifyContent: "flex-start", height: 30, alignItems: 'center', borderBottomColor: "#000", borderBottomWidth: 1 }}>
          <View style={{ flexDirection: 'row', width: "50%" }}>
            <Text style={{ fontSize: 17, color: "#000" }}>{key}</Text>
            <Text style={{ fontSize: 17, color: "#000", marginLeft: 12 }}>+{value}</Text>
          </View>
        </View>
      )
    })

    const upgradeNeedProps = mainAttr.needProps.map(item => {
      const prop = upgradeProps.find(prop => prop.key === item.split(',')[0])
      const propNum = item.split(',')[1]
      const { quality_style, image } = IconData(prop)
      return (
        <View key={prop.key} style={{ marginLeft: 12, marginRight: 12 }}>
          <TouchableWithoutFeedback onPress={() => { openPropDetail(prop) }}>
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
          <Text style={{ fontSize: 18, color: "#000", textAlign: 'center' }}>{propNum}</Text>
        </View>
      )
    })

    if (status === 1) {
      return (
        <View style={{ marginTop: 20 }}>
          {/* 属性icon 和 等级 */}
          <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: 'center' }}>
            <AttrIcon grade={mainAttr.grade} />
          </View>
          {/* 描述 */}
          <View style={{ marginTop: 12, borderBottomColor: "#000", borderBottomWidth: 1, height: 30, justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, color: "#000" }}>{mainAttr.desc}</Text>
          </View>

          {/* 副属性列表 */}
          <View style={{ marginTop: 8 }}>
            {subAttrsList}
          </View>
          {/* 升级需求 */}
          <View>
            <View style={{ width: 150, height: 35, backgroundColor: "#A0A0A0", justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
              <Text style={{ fontSize: 20, color: "#000" }}>升级需求</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 30 }}>
              <Text style={{ fontSize: 20, color: "#000" }}>已经达到最高等级</Text>
            </View>
          </View>
        </View>
      )
    }

    return (
      <View style={{ marginTop: 20 }}>
        {/* 属性icon 和 等级 */}
        <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
          <AttrIcon grade={mainAttr.grade} />
          <AntDesign name='arrowright' size={30} color={"#000"} />
          <AttrIcon grade={nextGrade} />
        </View>

        {/* 描述 */}
        <View style={{ marginTop: 12, borderBottomColor: "#000", borderBottomWidth: 1, height: 30, justifyContent: 'center' }}>
          <Text style={{ fontSize: 18, color: "#000" }}>{mainAttr.desc}</Text>
        </View>

        {/* 副属性列表 */}
        <View style={{ marginTop: 8 }}>
          {subAttrsList}
        </View>

        {/* 升级需求 */}
        <View>
          <View style={{ width: 150, height: 35, backgroundColor: "#A0A0A0", justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
            <Text style={{ fontSize: 20, color: "#000" }}>升级需求</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 30 }}>
            {upgradeNeedProps}
          </View>
        </View>

      </View>
    )
  }

  const animationEnd = () => {
    // setAttrView((view) => view.filter(item => item.key != currentKey))
    // console.log("");
  }

  const closeAnimation = () => {
    Animated.timing(gradeLeft, {
      toValue: -windowWidth,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }

  useEffect(() => {
    if (currentKey !== 0) {
      Animated.timing(gradeLeft, {
        toValue: 0,
        duration: 500,
        delay: 300,
        useNativeDriver: false,
      }).start(animationEnd)
    }

    // const listener = DeviceEventEmitter.addListener("SmallUniverseProject", (key) => {
    //   // console.log("key", key, currentKey);
    //   if (key - 1 === currentKey) {
    //     // closeAnimation()
    //   }
    // })

    // return () => {
    //   listener.remove();
    // };
  }, [])

  return (
    <Animated.View style={{
      width: "100%",
      height: '100%',
      position: "absolute",
      top: 0,
      left: gradeLeft,
      backgroundColor: "#ccc",
      borderRadius: 5,
      paddingLeft: 12,
      paddingRight: 12,
    }}>
      <Header />
      <Attr />
    </Animated.View>
  )
}

const UpgradePage = props => {
  const { mainAttr, onClose, upgradeProps, nextGrade, nextSubAttrs, status } = props;

  const [currentMainAttr, setCurrentMainAttr] = useState(mainAttr)
  const [currentUpgradeProps, setCurrentUpgradeProps] = useState(upgradeProps)
  const [currentNextGrade, setCurrentNextGrade] = useState(nextGrade)
  const [currentNextSubAttrs, setCurrentNextSubAttrs] = useState(nextSubAttrs)
  const [currentStatus, setCurrentStatus] = useState(status)

  const animatedLeft = useRef(new Animated.Value(0)).current;
  const key = useRef(0)
  const [attrView, setAttrView] = useState([
    <AttrDetail
      key={key.current}
      currentKey={key.current}
      mainAttr={currentMainAttr}
      upgradeProps={currentUpgradeProps}
      nextGrade={currentNextGrade}
      nextSubAttrs={currentNextSubAttrs}
      status={currentStatus}
      setAttrView={setAttrView}
      animatedLeft={animatedLeft}
    />
  ])

  // console.log("props", props);

  const closeAnimate = () => {
    Animated.timing(animatedLeft, {
      toValue: -windowWidth,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }

  const upgrade = () => {
    if (currentStatus === 0) {
      // console.log("attrView", attrView);
      props.dispatch(action("SmallUniverseProjectModel/UpgradeAttr")({ mainAttr: currentMainAttr, upgradeProps: currentUpgradeProps })).then((result) => {
        if (result !== undefined) {
          setCurrentMainAttr(result.mainAttr)
          setCurrentUpgradeProps(result.upgradeProps)
          setCurrentStatus(result.status)
          // DeviceEventEmitter.emit("SmallUniverseProject", key.current);
          key.current += 1
          setAttrView((view) => [
            ...view,
            <AttrDetail
              key={key.current}
              currentKey={key.current}
              mainAttr={result.mainAttr}
              upgradeProps={result.upgradeProps}
              nextGrade={result.nextGrade}
              nextSubAttrs={result.nextSubAttrs}
              status={result.status}
              setAttrView={setAttrView}
            />
          ])
        }
      })
    }
    if (currentStatus !== 0) {
      // console.log("ssss");
    }
  }

  const UpgradePropsComponent = () => {
    return (
      <View style={styles.upgradePropsContainer}>
        {currentUpgradeProps.map((item, index) => {
          const { quality_style, image } = IconData(item)
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
      <View style={{ height: '80%', width: "100%", }}>
        {attrView.map(item => item)}
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingLeft: 12, paddingRight: 12, justifyContent: "space-between" }}>
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

export default connect(state => ({ ...state.SmallUniverseProjectModel }))(UpgradePage);

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
    flexDirection: "row",
    justifyContent: "space-around"
  },
  viewContainer: {
    height: '100%', width: "100%",
  }
});
