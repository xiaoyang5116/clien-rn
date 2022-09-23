import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';

import { action, connect, } from '../../../constants'
import RootView from "../../RootView";

import { TextButton } from '../../../constants/custom-ui';
import UpgradePage from './UpgradePage';
import FastImage from 'react-native-fast-image';
import { isPad, px2pd } from '../../../constants/resolution';

const SmallUniverseProject = props => {
  const { onClose, smallUniverseProject_data } = props
  const { mainAttrs, allSubAttrs, levelProgress } = smallUniverseProject_data

  const MainAttrsComponent = () => {
    const upgrade = (item) => {
      props.dispatch(action('SmallUniverseProjectModel/getMainAttrInfo')(item)).then((result) => {
        if (result !== undefined) {
          const key = RootView.add(
            <UpgradePage
              mainAttr={item}
              {...result}
              onClose={() => {
                RootView.remove(key);
              }}
            />
          );
        }
      })
    }

    const position = [
      { top: "15%", left: "10%" },
      { top: "8%", right: "10%" },
      { top: "61%", left: "12%" },
      { top: "55%", right: "10%" },
    ]
    const MainAttrs = mainAttrs.map((item, index) => {
      const shiLi = item.subAttrs.find(f => f.split(',')[0] === "实力").split(',')[1]
      return (
        <View key={item.name} style={{ justifyContent: "center", alignItems: 'center', position: 'absolute', ...position[index] }}>
          <FastImage
            style={{ position: 'absolute', width: px2pd(266), height: px2pd(266) }}
            source={require('../../../../assets/games/SmallUniverseProject/quan.png')}
          />
          <TouchableOpacity onPress={() => { upgrade(item) }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
              <Text style={{ fontSize: 18, color: '#fff' }}>{item.name}</Text>
            </View>
          </TouchableOpacity>
          {/* <Text style={{ width: 80, backgroundColor: "#A0A0A0", fontSize: 16, paddingTop: 4, paddingBottom: 4, marginTop: 12, textAlign: 'center' }}>
            {shiLi}
          </Text> */}
        </View>
      )
    })
    return (
      <View style={{ height: "100%", width: "100%", flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
        <FastImage style={{ position: 'absolute', width: px2pd(432), height: px2pd(432) }} source={require('../../../../assets/games/SmallUniverseProject/leida.png')} />
        <View style={{ width: '100%', height: '100%', }}>
          {MainAttrs}
        </View>
      </View>
    )
  }

  const LevelProgressComponent = () => {
    return (
      <View style={{ height: "20%", justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 0 }}>
        <Text style={{
          fontSize: 30,
          color: "#fff",
          textShadowColor: '#000',
          textShadowRadius: 3,
          shadowOpacity: 0,
        }}>进度:{levelProgress}%</Text>
      </View>
    )
  }

  const SubAttrComponent = () => {
    const subAttrItem = ({ item }) => {
      return (
        <View style={{ width: "45%", height: 40, flexDirection: 'row', alignItems: 'center', borderBottomColor: "#fff", borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 16, color: '#fff' }}>{item.key}</Text>
          <Text style={{ fontSize: 16, color: '#fff', marginLeft: 12 }}>{item.value}</Text>
        </View>
      )
    }
    return (
      <View style={{ alignItems: 'center', width: "100%", height: '100%' }}>
        <FastImage
          resizeMode={"stretch"}
          // style={{ position: 'absolute', width: px2pd(998), height: px2pd(768), }}
          style={{ position: 'absolute', width: "100%", height: "100%", }}
          source={require('../../../../assets/games/SmallUniverseProject/subAttr_bg.png')}
        />
        <View style={{ justifyContent: "center", alignItems: 'center', height: (isPad() ? 50 : 30) }}>
          <Text style={{ fontSize: 18, color: "#000", }}>属性列表</Text>
        </View>
        <View style={{ marginTop: 12, width: "100%", paddingRight: 24, paddingLeft: 34 }}>
          <FlatList
            data={allSubAttrs}
            renderItem={subAttrItem}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: 'space-between'
            }}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.viewContainer}>
      <FastImage
        style={{ width: '100%', height: '100%', position: 'absolute' }}
        source={require("../../../../assets/games/SmallUniverseProject/bg.png")}
      />
      <SafeAreaView style={{ flex: 1, }}>
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <FastImage
              style={{ width: px2pd(997), height: px2pd(1011), position: 'absolute', opacity: 0.9 }}
              // style={{ width: px2pd(997), height: px2pd(1011), position: 'absolute', opacity: 0.9 }}
              source={require('../../../../assets/games/SmallUniverseProject/attr_bg.png')} />
            <MainAttrsComponent />
            <LevelProgressComponent />
          </View>
          <View style={styles.bottomContainer}>
            <SubAttrComponent />
          </View>
          <View style={styles.goBackContainer}>
            <TextButton title={"返回"} onPress={onClose} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default connect((state) => ({ ...state.SmallUniverseProjectModel }))(SmallUniverseProject);

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 99,
  },
  container: {
    justifyContent: "space-between",
    alignItems: 'center',
  },
  topContainer: {
    width: px2pd(997),
    height: px2pd(1011),
    // width: "90%",
    // height: "40%",
    alignItems: 'center',
    justifyContent: 'center',

  },
  bottomContainer: {
    // width: px2pd(998),
    // height: px2pd(768),
    width: px2pd(998),
    height: "30%",
    // backgroundColor: "red",
    marginTop: 20,
  },
  goBackContainer: {
    marginTop: 20,
    width: "90%"
  }
});
