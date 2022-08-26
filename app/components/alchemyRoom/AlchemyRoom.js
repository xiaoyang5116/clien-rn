import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import React, { useEffect } from 'react';

import { action, connect, ThemeContext, getPropIcon } from '../../constants';
import RootView from '../RootView';
import { now } from '../../utils/DateTimeUtils';

import DanFangPage from './DanFangPage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ProgressBar from './components/ProgressBar';
import { TextButton } from '../../constants/custom-ui';
import FastImage from 'react-native-fast-image';


// 奖励物品组件
const RewardItem = (props) => {
  // const icon = PROPS_ICON.find(e => e.iconId == props.iconId);
  const icon = getPropIcon(props.iconId);
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
  const { alchemyData } = props
  const theme = React.useContext(ThemeContext)
  const childs = [];
  let key = 0;
  alchemyData.targets.forEach(e => {
    childs.push(<RewardItem key={key++} propId={e.danFangId} iconId={e.iconId} num={e.num} name={e.name} />);
  });
  return (
    <TouchableWithoutFeedback onPress={() => {
      props.getAward()
      props.onClose()
    }}>
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.65)' }}>
        <View>
          <Text style={{ marginBottom: 20, color: '#ccc', fontSize: 36 }}>获得丹药</Text>
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

const AlchemyRoom = props => {
  const { alchemyData } = props

  // const 
  useEffect(() => {
    if (alchemyData === undefined) {
      props.dispatch(action('AlchemyModel/getAlchemyData')())
    }

  }, []);

  const openDanFangPage = () => {
    const key = RootView.add(
      <DanFangPage
        // {...props}
        onClose={() => {
          RootView.remove(key);
        }}
      />,
    );
  };

  const ChooseRecipe = () => {
    return (
      <View style={{ position: 'absolute', bottom: '30%' }}>
        <TouchableOpacity onPress={openDanFangPage}>
          <Text
            style={{
              fontSize: 20,
              backgroundColor: '#319331',
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 8,
              paddingBottom: 8,
            }}>
            选择配方
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const Header = () => {
    return (
      <View style={{ justifyContent: 'center', marginTop: 12 }}>
        <View style={{ position: 'absolute', zIndex: 2 }}>
          <TouchableOpacity onPress={props.onClose}>
            <AntDesign
              name="left"
              color={'#000'}
              size={23}
              style={{ marginLeft: 12 }}
            />
          </TouchableOpacity>
        </View>
        <Text style={{ textAlign: 'center', fontSize: 24, color: '#000' }}>
          炼丹房
        </Text>
      </View>
    );
  };

  const Refining = () => {
    // console.log("alchemyData", alchemyData);
    // {"danFangId": 1, "danFangName": "突破丹", "needTime": 100, "refiningTime": 1661481254117, "targets": [{"id": 440, "num": 1, "range": [Array], "rate": 20}]}
    // 时间差
    const diffTime = Math.floor((now() - alchemyData.refiningTime) / 1000)
    // 当前需要的时间
    const currentNeedTime = alchemyData.needTime - diffTime

    const onFinish = () => {
      const key = RootView.add(<RewardsPage
        alchemyData={alchemyData}
        getAward={() => { props.dispatch(action('AlchemyModel/alchemyFinish')()) }}
        onClose={() => {
          RootView.remove(key);
        }} />);
    }

    if (currentNeedTime < 0) {
      setTimeout(() => {
        onFinish()
      }, 0)
      return (
        <ChooseRecipe />
      )
    }

    return (
      <>
        <Text style={{ fontSize: 30, color: "#000", position: "absolute", top: 12 }}>炼制中</Text>
        <View style={{ position: 'absolute', bottom: '20%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, color: "#000" }}>{alchemyData.danFangName}</Text>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <ProgressBar needTime={alchemyData.needTime} currentNeedTime={currentNeedTime} onFinish={onFinish} />
          </View>
        </View>
      </>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ccc' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Header />
        <View style={{ flex: 1, justifyContent: "flex-end", alignItems: 'center' }}>
          {
            alchemyData ? <Refining /> : <ChooseRecipe />
          }
          <View style={{ width: "90%", marginBottom: 20 }} >
            <TextButton onPress={props.onClose} title={"离开"} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default connect(state => ({ ...state.AlchemyModel }))(AlchemyRoom);

const styles = StyleSheet.create({});
