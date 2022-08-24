import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect } from 'react';

import { action, connect } from '../../constants';
import RootView from '../RootView';

import DanFangPage from './DanFangPage';
import AntDesign from 'react-native-vector-icons/AntDesign';

const AlchemyRoom = props => {
  useEffect(() => {
    props.dispatch(action('AlchemyModel/getDanFangData')());
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
  return (
    <View style={{ flex: 1, backgroundColor: '#ccc' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Header />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ChooseRecipe />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default connect(state => ({ ...state.AlchemyModel }))(AlchemyRoom);

const styles = StyleSheet.create({});
