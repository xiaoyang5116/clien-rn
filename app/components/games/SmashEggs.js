import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import { action, connect, ThemeContext } from '../../constants'
import lo from 'lodash';

import RootView from '../RootView';
import FastImage from 'react-native-fast-image';
import { HalfPanel } from '../panel/HalfPanel'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { confirm } from '../dialog'


const eggStatusImg = [
  { source: require('../../../assets/games/egg/no_open.png') },
  { source: require('../../../assets/games/egg/open.png') },
]

const PROPS_ICON = [
  { iconId: 1, img: require('../../../assets/props/prop_1.png') },
  { iconId: 2, img: require('../../../assets/props/prop_2.png') },
  { iconId: 3, img: require('../../../assets/props/prop_3.png') },
  { iconId: 4, img: require('../../../assets/props/prop_4.png') },
  { iconId: 5, img: require('../../../assets/props/prop_5.png') },
];

// 奖励物品组件
const RewardItem = (props) => {
  const icon = PROPS_ICON.find(e => e.iconId == props.iconId);
  return (
    <View style={{ flexDirection: 'column', margin: 10, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: 64, height: 64 }}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderColor: '#ccc', borderWidth: 0, backgroundColor: '#333', borderRadius: 10 }}>
          <Image source={icon.img} />
          <Text style={{ position: 'absolute', top: 46, right: 5, color: '#fff' }}>{props.num}</Text>
        </View>
      </View>
      <Text style={{ color: '#000', marginTop: 3 }}>{props.name}</Text>
    </View>
  );
}

// 奖励显示页面
const RewardsPage = (props) => {
  const theme = React.useContext(ThemeContext)
  const childs = [];
  let key = 0;
  props.data.forEach(e => {
    childs.push(<RewardItem key={key++} propId={e.propId} iconId={e.iconId} num={e.num} name={e.name} />);
  });

  const closeHandler = () => {
    props.onClose()
    if (props.remainNumber === 1) {
      confirm("次数用完!", () => {
        props.closeEggPage()
      })
    }
  }

  return (
    <TouchableWithoutFeedback onPress={closeHandler}>
      <View style={{ flex: 1, zIndex: 99, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.65)' }}>
        <View>
          <Text style={{ marginBottom: 20, color: '#ccc', fontSize: 36 }}>获得奖励</Text>
        </View>
        <ImageBackground style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#a6c2cb' }} source={theme.blockBg_5_img}>
          <FastImage style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 2 }} resizeMode='stretch' source={require('../../../assets/bg/dialog_line.png')} />
          {childs}
          <FastImage style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 2 }} resizeMode='stretch' source={require('../../../assets/bg/dialog_line.png')} />
        </ImageBackground>
        <View>
          <Text style={{ marginTop: 20, color: '#fff', fontSize: 20 }}>点击任意区域关闭</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const SmashEggs = (props) => {
  // props: {"eggNumber": 3, "id": 6, "onClose": [Function onClose], "remainNumber": 1, "treasureChestId": 1}
  const { treasureChestId } = props

  if (treasureChestId === undefined) {
    console.debug("宝箱id 未配置")
    return null
  }

  const [remainNumber, setRemainNumber] = useState(props.remainNumber ? props.remainNumber : 1)
  const eggNumber = props.eggNumber ? props.eggNumber : 3
  const [eggData, setEggData] = useState([])

  useEffect(() => {
    if (props.treasureChestData.length === 0) {
      props.dispatch(action('TreasureChestModel/getTreasureChestData')())
    }

    const currentEggData = []
    for (let index = 0; index < eggNumber; index++) {
      currentEggData.push({
        id: index,
        status: 0,
      })
    }
    setEggData(currentEggData)
  }, [])

  const openEgg = (id) => {
    if (remainNumber === 0) return

    setRemainNumber((remainNumber) => remainNumber - 1)

    const currentEggData = eggData.map(item => item.id === id ? { ...item, status: 1 } : item)
    setEggData(currentEggData)

    props.dispatch(action('TreasureChestModel/openTreasureChest')({ id: treasureChestId }))
      .then(data => {
        if (lo.isArray(data)) {
          const key = RootView.add(<RewardsPage closeEggPage={props.onClose} remainNumber={remainNumber} data={data} onClose={() => {
            RootView.remove(key);
          }} />);
        }
      });
  }

  const Header = () => {
    return (
      <View>
        <Text style={styles.header_title}>碰运气</Text>
        <View style={styles.close}>
          <TouchableWithoutFeedback onPress={() => {
            if (props.onClose != undefined) {
              props.onClose();
            }
          }}>
            <AntDesign name='close' size={24} />
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }

  const Eggs = () => {
    return (
      <View style={styles.img_container}>
        {
          eggData.map((item, index) => {
            if (item.status === 1) {
              return (
                <View key={item.id} style={styles.img_box}>
                  <Image source={eggStatusImg[item.status].source} style={styles.img} />
                </View>
              )
            }
            return (
              <View key={item.id} style={styles.img_box}>
                <TouchableOpacity onPress={() => { openEgg(item.id) }}>
                  <Image source={eggStatusImg[item.status].source} style={styles.img} />
                </TouchableOpacity>
              </View>
            )
          })
        }
      </View>
    )
  }

  return (
    <HalfPanel style={{ height: "100%", justifyContent: 'center' }}>
      <View style={{ backgroundColor: "#fff", }}>
        <Header />
        <Text style={styles.TipTitle}>你还有{remainNumber}次选择的机会</Text>
        <Eggs />
      </View>
    </HalfPanel>
  )
}

export default connect((state) => ({ ...state.TreasureChestModel }))(SmashEggs)

const styles = StyleSheet.create({
  header_title: {
    marginTop: 12,
    fontSize: 20,
    color: "#000",
    textAlign: "center",
  },
  close: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  TipTitle: {
    fontSize: 18,
    color: "#000",
    textAlign: "center",
    marginTop: 18,
  },
  img_container: {
    marginTop: 12,
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  img_box: {
    marginTop: 24,
    paddingLeft: 12,
    paddingRight: 12,
    height: 130,
    width: "33%",
  },
  img: {
    width: "100%",
    height: "100%",
  }
}) 