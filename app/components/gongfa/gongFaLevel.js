import { SafeAreaView, StyleSheet, Text, View, Platform, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'

import { connect, action } from '../../constants'
import { TextButton } from '../../constants/custom-ui'


const GongFaLevel = (props) => {
  const { gongFaConfig, gongFaProgressData } = props
  const [gongFaLevelData, setGongFaLevelData] = useState([])

  useEffect(() => {
    props.dispatch(action('GongFaModel/getGongFaLevelData')()).then(result => {
      if (result !== undefined) {
        setGongFaLevelData(result)
      }
    })
  }, [])

  const GongFa = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => {}}>
        <View style={styles.gongFa}>
          <View style={styles.gongFaImag}></View>
          <Text style={styles.gongFaName}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const _renderItem = ({ item, index }) => {
    return (
      <View style={{ marginTop: 40 }}>
        <View style={styles.gongFaLevelContainer}>
          <View style={styles.line} />
          <Text style={styles.levelText}>{item.levelName}</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.gongFaContainer}>
          {item.gongFaConfig.map(i => <GongFa key={i.gongFaId} item={i} />)}
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={gongFaLevelData}
        renderItem={_renderItem}
      />
    </View>
  )
}

export default connect((state) => ({ ...state.GongFaModel }))(GongFaLevel)

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    zIndex: 99,
    backgroundColor: "#fff"
  },
  gongFaLevelContainer: {
    width: "100%",
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "center",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#000"
  },
  levelText: {
    fontSize: 22,
    color: "#000",
    marginLeft: 30,
    marginRight: 30
  },
  gongFaContainer: {
    width: "100%",
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "nowrap",
    // justifyContent: "center",
    justifyContent: "space-evenly",
    alignItems: 'center'
  },
  gongFaImag: {
    width: 100,
    height: 100,
    backgroundColor: 'red',
  },
  gongFaName: {
    fontSize: 16,
    color: "#000",
    textAlign: 'center',
    marginTop: 8,
  },
})