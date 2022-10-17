import { FlatList, StyleSheet, Text, View, TouchableHighlight, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'

import qualityStyle from '../../../themes/qualityStyle'
import { action, connect, getPropIcon } from '../../../constants'
import { px2pd } from '../../../constants/resolution'
import Toast from '../../toast';

import FastImage from 'react-native-fast-image'
import { TextButton } from '../../../constants/custom-ui'


const row = 6
const column = 6
// status: 0-不可翻开 || 1-可翻开 || 2-已翻开 
// type: "入口" || "出口" || "道具" || "空" || "墙"
const DATA = [
  { x: 0, y: 0, type: "墙", status: 0, }, { x: 1, y: 0, type: "空", status: 0, }, { x: 2, y: 0, type: "空", status: 0, }, { x: 3, y: 0, status: 0, }, { x: 4, y: 0, status: 0, }, { x: 5, y: 0, status: 0, },
  { x: 0, y: 1, type: "墙", status: 0, }, { x: 1, y: 1, type: "空", status: 0, }, { x: 2, y: 1, type: "空", status: 0, }, { x: 3, y: 1, status: 0, }, { x: 4, y: 1, status: 0, }, { x: 5, y: 1, status: 0, },
  { x: 0, y: 2, type: "墙", status: 0, }, { x: 1, y: 2, type: "空", status: 0, }, { x: 2, y: 2, type: "空", status: 0, }, { x: 3, y: 2, status: 0, }, { x: 4, y: 2, status: 0, }, { x: 5, y: 2, status: 0, },
  { x: 0, y: 3, type: "墙", status: 0, }, { x: 1, y: 3, type: "道具", status: 0, prop: { id: 30, num: 1, iconId: 1, quality: 1, } }, { x: 2, y: 3, type: "空", status: 0, }, { x: 3, y: 3, status: 0, }, { x: 4, y: 3, status: 0, }, { x: 5, y: 3, status: 0, },
  { x: 0, y: 4, type: "墙", status: 0, }, { x: 1, y: 4, type: "空", status: 1, }, { x: 2, y: 4, type: "空", status: 0, }, { x: 3, y: 4, status: 0, }, { x: 4, y: 4, status: 0, }, { x: 5, y: 4, status: 0, },
  { x: 0, y: 5, type: "墙", status: 0, }, { x: 1, y: 5, type: "入口", status: 0, }, { x: 2, y: 5, type: "空", status: 1, }, { x: 3, y: 5, status: 0, }, { x: 4, y: 5, status: 0, }, { x: 5, y: 5, status: 0, },
]

const Grid = (props) => {
  const { index, item, onClick } = props

  const _onPress = () => {
    if (item.status != 0 && item.status != 3) onClick(item)
  }

  let bgColor = ""
  if (item.status === 0) {
    bgColor = "#0E64FF"
  } else if (item.status === 1) {
    bgColor = "#689CFA"
  } else {
    bgColor = "#A0A0A0"
  }
  return (
    <TouchableHighlight onPress={_onPress}>
      <View style={[styles.gridContainer, {
        backgroundColor: bgColor
      }]}>
      </View>
    </TouchableHighlight>

  )
}

// 不可翻开状态
const Grid_0 = (props) => {
  return (
    <View style={[
      styles.gridContainer,
      { backgroundColor: "#689CFA", opacity: 0.7 }
    ]} />
  )
}

// 可翻开状态
const Grid_1 = ({ item, openGrid }) => {
  return (
    <TouchableHighlight onPress={openGrid}>
      <View style={[
        styles.gridContainer,
        { backgroundColor: "#F76363", opacity: 0.7 }
      ]} />
    </TouchableHighlight>
  )
}

// 已翻开状态
const Grid_2 = (props) => {
  return <View style={[styles.gridContainer]} />
}

// 入口格子
const Grid_Entrance = (props) => {
  return (
    <View style={[
      styles.gridContainer,
      // { backgroundColor: "#69D1CA", opacity: 0.9 }
    ]} />
  )
}

// 墙格子
const Grid_Wall = (props) => {
  return (
    <View style={[
      styles.gridContainer,
      { backgroundColor: "#0E64FF" }
    ]} />
  )
}

// 空格子
const Grid_Empty = ({ item, openGrid }) => {
  if (item.status === 0) {
    return <Grid_0 />
  }
  if (item.status === 1) {
    return <Grid_1 openGrid={openGrid} />
  }
  if (item.status === 2) {
    return <Grid_2 />
  }
  return <Grid_0 />
}

// 道具格子
const Grid_Prop = ({ item, openGrid }) => {
  const { prop } = item
  const quality_style = qualityStyle.styles.find(
    e => e.id == parseInt(prop.quality),
  );
  const image = getPropIcon(prop.iconId);

  let status = <></>
  if (item.status === 0) {
    status = <Grid_0 />
  }
  if (item.status === 1) {
    status = <Grid_1 openGrid={openGrid} />
  }

  if (item.status === 2) {
    return (
      <TouchableOpacity onPress={() => { Toast.show("sss") }}>
        <View style={[styles.gridContainer, { justifyContent: 'center', alignItems: "center" }]}>
          <FastImage
            style={{
              position: 'absolute',
              width: 40,
              height: 40,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: quality_style.borderColor,
              backgroundColor: quality_style.backgroundColor,
            }}
            source={image.img}
          />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.gridContainer, { justifyContent: 'center', alignItems: "center" }]}>
      <FastImage
        style={{
          position: 'absolute',
          width: 40,
          height: 40,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: quality_style.borderColor,
          backgroundColor: quality_style.backgroundColor,
        }}
        source={image.img}
      />
      {status}
    </View>
  )
}

const TurnLattice = (props) => {
  const { onClose, turnLatticeData } = props

  const [data, setData] = useState(DATA)
  // const [data, setData] = useState([])
  // console.log("turnLatticeData",turnLatticeData);
  
  useEffect(() => {
    // props.dispatch(action('TurnLatticeModel/getTurnLatticeData')()).then(result => {
    //   // console.log(result[0].level);
    //   // setData(result)
    // })
  }, [])

  const onClick = (item) => {
    const curIndex = data.findIndex(i => i.x === item.x && i.y === item.y)
    data[curIndex].status = 2

    // 上面
    if ((item.y - 1) >= 0) {
      const topIndex = data.findIndex(i => i.x === item.x && i.y === item.y - 1)
      if (data[topIndex].status === 0) {
        data[topIndex].status = 1
      }
    }

    // 下面
    if ((item.y + 1) < row) {
      const botIndex = data.findIndex(i => i.x === item.x && i.y === item.y + 1)
      if (data[botIndex].status === 0) {
        data[botIndex].status = 1
      }
    }

    //左面
    if ((item.x - 1) >= 0) {
      const leftIndex = data.findIndex(i => i.x === item.x - 1 && i.y === item.y)
      if (data[leftIndex].status === 0) {
        data[leftIndex].status = 1
      }
    }
    // 右边
    if ((item.x + 1) < column) {
      const rightIndex = data.findIndex(i => i.x === item.x + 1 && i.y === item.y)
      if (data[rightIndex].status === 0) {
        data[rightIndex].status = 1
      }
    }

    setData([...data])
  }

  // 判断是否可以把格子 status 改为 1
  function isCanOpenedGrid(item) {
    if (item.status === 0 && item.type !== "墙" && item.type !== "入口") return true
    return false
  }

  // 翻开格子
  const openGrid = (item) => {
    const curIndex = data.findIndex(i => i.x === item.x && i.y === item.y)
    data[curIndex].status = 2

    // 上面
    if ((item.y - 1) >= 0) {
      const topIndex = data.findIndex(i => i.x === item.x && i.y === item.y - 1)
      if (isCanOpenedGrid(data[topIndex])) {
        data[topIndex].status = 1
      }
    }

    // 下面
    if ((item.y + 1) < row) {
      const botIndex = data.findIndex(i => i.x === item.x && i.y === item.y + 1)
      if (isCanOpenedGrid(data[botIndex])) {
        data[botIndex].status = 1
      }
    }

    //左面
    if ((item.x - 1) >= 0) {
      const leftIndex = data.findIndex(i => i.x === item.x - 1 && i.y === item.y)
      if (isCanOpenedGrid(data[leftIndex])) {
        data[leftIndex].status = 1
      }
    }
    // 右边
    if ((item.x + 1) < column) {
      const rightIndex = data.findIndex(i => i.x === item.x + 1 && i.y === item.y)
      if (isCanOpenedGrid(data[rightIndex])) {
        data[rightIndex].status = 1
      }
    }

    setData([...data])
  }

  // 获得道具
  // const 

  const _renderItem = ({ item, index }) => {
    // return <Grid index={index} item={item} onClick={onClick} />
    if (item.type === "入口") return <Grid_Entrance item={item} />
    // if (item.type === "出口") return <Grid_1 item={item} />
    if (item.type === "道具") return <Grid_Prop item={item} openGrid={() => { openGrid(item) }} />
    if (item.type === "空") return <Grid_Empty item={item} openGrid={() => { openGrid(item) }} />
    if (item.type === "墙") return <Grid_Wall item={item} />

    return <Grid_Empty item={item} openGrid={() => { openGrid(item) }} />
  }

  return (
    <View style={styles.viewContainer}>
      <View style={{ width: 300, height: 300 }}>
        <Image
          style={{ width: "100%", height: "100%", position: "absolute", }}
          source={require('../../../../assets/bg/baojian.png')}
        />
        <FlatList
          overScrollMode={"never"}
          bounces={false}
          data={data}
          renderItem={_renderItem}
          numColumns={6}
        // extraData={click}
        />
      </View>
      <TextButton title="退出" onPress={onClose} style={{ marginTop: 20 }} />
    </View>
  )
}

export default connect((state) => ({ ...state.TurnLatticeModel }))(TurnLattice)

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 99,
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center'
  },
  gridContainer: {
    width: 50,
    height: 50,
    borderColor: "#fff",
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
})