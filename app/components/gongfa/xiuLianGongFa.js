import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import { connect, action } from '../../constants';
import RootView from '../RootView';
import { TextButton } from '../../constants/custom-ui';

const location = [
  { top: "60%", left: "10%" },
  { top: "70%", left: "30%" },
  { top: "55%", left: "40%" },

  { top: "35%", left: "22%" },
  { top: "12%", left: "22%" },
  { top: "15%", left: "49%" },

  { top: "13%", left: "65%" },
  { top: "23%", left: "80%" },
  { top: "35%", left: "60%" },

  { top: "65%", left: "55%" },
]

const XiuLianGongFa = (props) => {
  const { gongFa, gongFaProgress, onClose } = props
  const { name, desc } = gongFa
  const { gongFaStatus, gongFaLayer, gongFaGrade } = gongFaProgress;
  const layerConfig = gongFa.layerConfig[gongFaLayer]

  const [checkedIndex, setCheckedIndex] = useState(gongFaGrade + 1)

  const Grade = ({ item }) => {
    return (
      <View style={{ position: "absolute", ...location[item.grade - 1] }}>
        <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => { setCheckedIndex(item.grade) }}>
          <View style={{ opacity: item.grade === checkedIndex ? 1 : 0 }}>
            <Text>{item.desc}</Text>
          </View>
          <View style={[styles.round, { backgroundColor: item.grade === checkedIndex ? "#F5BA1C" : null }]}>
            <Text>{item.title}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const Footer = () => {
    return (
      <View style={styles.footerContainer}>
        <View style={styles.footerLeft}>
          <TextButton title={"返回"} onPress={onClose} />
        </View>
        <View style={styles.footerRight}>
          <TextButton title={"下一层"} onPress={onClose} />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.viewContainer}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* <GongFaDetail /> */}
        <View style={{ flex: 1 }}>
          <View style={styles.gongFaNameContainer}>
            <Text style={styles.gongFaName}>{name}</Text>
          </View>
          {/* 功法等级 */}
          <View style={{ flex: 1 }}>
            <View style={{ width: "100%", height: 400, }}>
              {layerConfig.map((item, index) => {
                return <Grade key={item.grade} item={item} />
              })}
            </View>
            <View>
              <TextButton title={"修炼"} onPress={() => { console.log("sss"); }} />
            </View>
          </View>
        </View>
        <Footer />
      </SafeAreaView>
    </View>
  )
}

export default connect((state) => ({ ...state.GongFaModel }))(XiuLianGongFa)

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  gongFaNameContainer: {
    width: "100%",
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
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 60,
    borderColor: "#000",
  },
  footerContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center"
  },
  footerLeft: {
    marginLeft: 18,
  },
  footerRight: {
    marginRight: 18,
  }
})