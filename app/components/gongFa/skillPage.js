import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import { connect, action } from '../../constants';
import RootView from '../RootView';

import { TextButton } from '../../constants/custom-ui';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SkillsList, { SkillDetail } from './components/SkillsList';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';

const AddSkillComponent = props => {
  return (
    <TouchableOpacity style={{ marginTop: 20 }} onPress={props.onPress}>
      <ImageBackground
        style={{ width: px2pd(1056), height: px2pd(231), justifyContent: 'center', alignItems: 'center' }}
        source={require('../../../assets/gongFa/skill/unequipped.png')}>
        <ImageBackground
          style={{ width: px2pd(543), height: px2pd(111), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
          source={require('../../../assets/gongFa/skill/add_bg.png')}>
          <FastImage style={{ width: px2pd(55), height: px2pd(56) }} source={require('../../../assets/gongFa/skill/add_icon.png')} />
          <Text style={{ fontSize: 16, color: "#49596d", marginLeft: 4 }}>(点击添加技能)</Text>
        </ImageBackground>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const SkillPage = props => {
  const { equipmentSkills, gongFaProgressData, gongFaConfig } = props;
  const [reload, setReload] = useState(false);
  const [skillSwitch, setSkillSwitch] = useState('主动');

  const openSkillsList = index => {
    const key = RootView.add(
      <SkillsList
        equipmentIndex={index}
        onClose={() => {
          RootView.remove(key);
          setReload(!reload);
        }}
      />,
    );
  };

  const _renderSkills = ({ item, index }) => {
    if (item.isUnlock) {
      if (item._id === undefined) {
        return (
          <AddSkillComponent
            onPress={() => {
              openSkillsList(index);
            }}
          />
        );
      } else {
        const { levelName } = gongFaConfig.gongFaLevelData.find(f => {
          return f.gongFaId.find(id => id === item.gongFaId) != undefined;
        });
        return (
          <View style={{ marginTop: 20 }}>
            <SkillDetail
              levelName={levelName}
              skillData={item}
              onPress={() => {
                openSkillsList(index);
              }}
              isShowIcon={false}
            />
          </View>
        );
      }
    } else {
      return (
        <View style={{ marginTop: 20 }}>
          <FastImage style={{ width: px2pd(1056), height: px2pd(231) }} source={require('../../../assets/gongFa/skill/lock_bg.png')} />
        </View>
      );
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <FastImage
        style={{ width: px2pd(1080), height: px2pd(179) }}
        source={require('../../../assets/gongFa/skill/title.png')}
      />
      <ImageBackground
        style={{
          marginTop: 12,
          width: px2pd(1056),
          height: px2pd(117),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        source={require('../../../assets/gongFa/skill/skill_switch.png')}>
        <TouchableOpacity
          style={{
            width: '45%',
            height: px2pd(74),
          }}
          onPress={() => {
            setSkillSwitch('主动');
          }}>
          <View
            style={{
              height: px2pd(74),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {skillSwitch === '主动' ? (
              <FastImage
                style={{
                  width: px2pd(366),
                  height: px2pd(74),
                  position: 'absolute',
                }}
                source={require('../../../assets/gongFa/skill/skill_switch_bg.png')}
              />
            ) : (
              <></>
            )}
            <Text style={{ color: '#354252', fontSize: 16 }}>
              {`主动技能 (1/3)`}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: '45%',
            height: px2pd(74),
          }}
          onPress={() => {
            setSkillSwitch('被动');
          }}>
          <View
            style={{
              height: px2pd(74),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {skillSwitch === '被动' ? (
              <FastImage
                style={{
                  width: px2pd(366),
                  height: px2pd(74),
                  position: 'absolute',
                }}
                source={require('../../../assets/gongFa/skill/skill_switch_bg.png')}
              />
            ) : (
              <></>
            )}
            <Text style={{ color: '#354252', fontSize: 16 }}>
              {`被动技能 (1/3)`}
            </Text>
          </View>
        </TouchableOpacity>
      </ImageBackground>
      <View style={{ flex: 1, width: "100%", alignItems: 'center' }}>
        <FlatList
          data={equipmentSkills}
          renderItem={_renderSkills}
          extraData={reload}
        />
      </View>
    </View>
  );
};

export default connect(state => ({ ...state.GongFaModel }))(SkillPage);

const styles = StyleSheet.create({
  skillContainer: {
    height: 100,
    width: '100%',
    borderColor: '#000',
    borderWidth: 1,
    marginTop: 24,
  },
});
