import { FlatList, StyleSheet, Text, View, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'

const row = 6
const column = 6
// status: 0-未打开,不能点击  |  1-未打开,可以点击  |  2-已打开,显示事件,可以点击  |  3-事件点击过,显示底图,不可点击
const DATA = [
  { x: 0, y: 0, status: 3, }, { x: 1, y: 0, status: 1, }, { x: 2, y: 0, status: 0, }, { x: 3, y: 0, status: 0, }, { x: 4, y: 0, status: 0, }, { x: 5, y: 0, status: 0, },
  { x: 0, y: 1, status: 1, }, { x: 1, y: 1, status: 0, }, { x: 2, y: 1, status: 0, }, { x: 3, y: 1, status: 0, }, { x: 4, y: 1, status: 0, }, { x: 5, y: 1, status: 0, },
  { x: 0, y: 2, status: 0, }, { x: 1, y: 2, status: 0, }, { x: 2, y: 2, status: 0, }, { x: 3, y: 2, status: 0, }, { x: 4, y: 2, status: 0, }, { x: 5, y: 2, status: 0, },
  { x: 0, y: 3, status: 0, }, { x: 1, y: 3, status: 0, }, { x: 2, y: 3, status: 0, }, { x: 3, y: 3, status: 0, }, { x: 4, y: 3, status: 0, }, { x: 5, y: 3, status: 0, },
  { x: 0, y: 4, status: 0, }, { x: 1, y: 4, status: 0, }, { x: 2, y: 4, status: 0, }, { x: 3, y: 4, status: 0, }, { x: 4, y: 4, status: 0, }, { x: 5, y: 4, status: 0, },
  { x: 0, y: 5, status: 0, }, { x: 1, y: 5, status: 0, }, { x: 2, y: 5, status: 0, }, { x: 3, y: 5, status: 0, }, { x: 4, y: 5, status: 0, }, { x: 5, y: 5, status: 0, },
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

const NauticalExploration = (props) => {

  const [click, setClick] = useState(0)
  const [data, setData] = useState(DATA)

  const onClick = (item) => {
    console.log("item", item);
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

  const _renderItem = ({ item, index }) => {
    return <Grid index={index} item={item} onClick={onClick} />
  }

  return (
    <View style={styles.viewContainer}>
      <View style={{ width: 300, height: 300 }}>
        <FlatList
          data={data}
          renderItem={_renderItem}
          numColumns={6}
          extraData={click}
        />
      </View>
    </View>
  )
}

export default NauticalExploration

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
    // backgroundColor: 'blue',
    borderColor: "#fff",
    borderBottomWidth: 1,
    borderRightWidth: 1
  },
})