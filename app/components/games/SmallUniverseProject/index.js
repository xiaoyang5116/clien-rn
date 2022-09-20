import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';

import { action, connect, } from '../../../constants'
import RootView from "../../RootView";

import { TextButton } from '../../../constants/custom-ui';
import UpgradePage from './UpgradePage';

const SmallUniverseProject = props => {
  const { onClose, smallUniverseProject_data } = props

  // console.log("smallUniverseProject_data", smallUniverseProject_data);
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

    const MainAttrs = mainAttrs.map(item => {
      const shiLi = item.subAttrs.find(f => f.split(',')[0] === "实力").split(',')[1]
      return (
        <View key={item.name} style={{ width: "50%", height: "50%", justifyContent: "center", alignItems: 'center' }}>
          <TouchableOpacity onPress={() => { upgrade(item) }}>
            <View style={{ width: 80, height: 80, backgroundColor: "#fff", borderRadius: 40, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
              <Text style={{ fontSize: 18, color: '#000' }}>{item.name}</Text>
            </View>
          </TouchableOpacity>
          <Text style={{ width: 80, backgroundColor: "#A0A0A0", fontSize: 16, paddingTop: 4, paddingBottom: 4, marginTop: 12, textAlign: 'center' }}>
            {shiLi}
          </Text>
        </View>
      )
    })
    return (
      <View style={{ height: "80%", width: "100%", flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
        {MainAttrs}
      </View>
    )
  }

  const LevelProgressComponent = () => {
    return (
      <View style={{ height: "20%", justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: "#000" }}>进度:{levelProgress}%</Text>
      </View>
    )
  }

  const SubAttrComponent = () => {
    const subAttrItem = ({ item }) => {
      return (
        <View style={{ width: "45%", height: 40, flexDirection: 'row', alignItems: 'center', borderBottomColor: "A0A0A0", borderBottomWidth: 1 }}>
          <Text style={{ fontSize: 16, color: '#000' }}>{item.key}</Text>
          <Text style={{ fontSize: 16, color: '#000', marginLeft: 12 }}>{item.value}</Text>
        </View>
      )
    }
    return (
      <View style={{ paddingLeft: 12, paddingRight: 12 }}>
        <View style={{ marginTop: 20, width: 130, height: 35, backgroundColor: '#A0A0A0', justifyContent: "center", alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: "#000" }}>属性列表</Text>
        </View>
        <View style={{ marginTop: 18 }}>
          <FlatList
            data={allSubAttrs}
            renderItem={subAttrItem}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: 'space-between'
            }}
          />
        </View>
        {/* {SubAttrList } */}
      </View>
    )
  }

  return (
    <View style={styles.viewContainer}>
      <SafeAreaView style={{ flex: 1, }}>
        <View style={styles.container}>
          <View style={styles.topContainer}>
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
    backgroundColor: '#ccc',
  },
  container: {
    justifyContent: "space-between",
    alignItems: 'center',
  },
  topContainer: {
    width: "90%",
    height: '55%',
    borderColor: '#000',
    borderWidth: 1,
  },
  bottomContainer: {
    width: "90%",
    height: '35%',
    borderColor: '#000',
    borderWidth: 1,
  },
  goBackContainer: {
    width: "90%"
  }
});
