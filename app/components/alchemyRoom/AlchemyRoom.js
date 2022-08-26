import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect } from 'react';

import { action, connect } from '../../constants';
import RootView from '../RootView';
import { now } from '../../utils/DateTimeUtils';

import DanFangPage from './DanFangPage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ProgressBar from './components/ProgressBar';

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
      props.dispatch(action('AlchemyModel/alchemyFinish')())
    }

    if (currentNeedTime < 0) {
      return (
        <View style={{ position: 'absolute', bottom: '5%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, color: "#000" }}>{alchemyData.danFangName}</Text>
          <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ height: 15, width: 300, backgroundColor: "#e0e0e0", borderRadius: 12, overflow: 'hidden', }}>
              <View style={{
                position: "absolute", top: 0, left: 0, height: 15, width: "100%", backgroundColor: "#33ad85", zIndex: 0,
              }} ></View>
            </View>
            <Text style={{ textAlign: 'center', position: "absolute" }}>100%</Text>
          </View>
          <TouchableOpacity onPress={onFinish}>
            <Text style={{ fontSize: 30, color: "#000" }}>炼制完成,点击领取</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <View style={{ position: 'absolute', bottom: '5%', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, color: "#000" }}>{alchemyData.danFangName}</Text>
        <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
          <ProgressBar needTime={alchemyData.needTime} currentNeedTime={currentNeedTime} onFinish={onFinish} />
        </View>
        <Text style={{ fontSize: 30, color: "#000" }}>炼制中</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ccc' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Header />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {
            alchemyData ? <Refining /> : <ChooseRecipe />
          }
        </View>
      </SafeAreaView>
    </View>
  );
};

export default connect(state => ({ ...state.AlchemyModel }))(AlchemyRoom);

const styles = StyleSheet.create({});
