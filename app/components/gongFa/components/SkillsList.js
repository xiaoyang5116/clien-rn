import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, ImageBackground } from 'react-native';
import React, { useRef } from 'react';

import { connect, action, getSkillIcon, getBtnIcon } from '../../../constants';
import FastImage from 'react-native-fast-image';
import { ReturnButton, TextButton } from '../../../constants/custom-ui';
import { px2pd } from '../../../constants/resolution';


export const SkillDetail = (props) => {
  const { skillData, levelName, onPress, isShowIcon } = props

  return (
    <TouchableOpacity disabled={isShowIcon} onPress={onPress}>
      <ImageBackground style={{ width: px2pd(1056), height: px2pd(231), flexDirection: "row", alignItems: 'center' }} source={require('../../../../assets/gongFa/skill/skill_bg.png')}>
        <FastImage style={{ width: px2pd(190), height: px2pd(177), marginLeft: 20 }} source={getSkillIcon(skillData._iconId)} />
        <View style={{ flex: 1, justifyContent: "center", paddingBottom: 8, paddingTop: 8, marginLeft: 20, marginRight: 12 }}>
          <View style={{ height: "33%", flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start" }}>
            <ImageBackground style={{ width: px2pd(156), height: px2pd(51), justifyContent: 'center', alignItems: 'center' }} source={require('../../../../assets/gongFa/skill/zhaoshijieduan.png')}>
              <Text style={{ color: "#61748c", fontSize: 14 }}>{levelName}</Text>
            </ImageBackground>
            <Text style={{ color: "#495a6d", fontSize: 14, marginLeft: 100 }}>{skillData._name}</Text>
          </View>
          <FastImage style={{ width: px2pd(784), height: px2pd(2) }} source={require('../../../../assets/gongFa/skill/line.png')} />
          <View style={{ height: "33%", justifyContent: 'center', alignItems: 'center', }}>
            <Text style={{ color: '#4a5b70', fontSize: 14, }}>{skillData._desc}</Text>
          </View>
          <View style={{ height: "33%", flexDirection: 'row', alignItems: 'center', justifyContent: "space-evenly" }}>
            <ImageBackground style={{ width: px2pd(368), height: px2pd(45), justifyContent: 'center', alignItems: 'center' }} source={require('../../../../assets/gongFa/skill/xiaohao_bg.png')}>
              <Text style={{ color: "#4a5b70" }}>{`消耗法力: ${skillData._consume[0].mp}`}</Text>
            </ImageBackground>
            <ImageBackground style={{ width: px2pd(368), height: px2pd(45), justifyContent: 'center', alignItems: 'center' }} source={require('../../../../assets/gongFa/skill/xiaohao_bg.png')}>
              <Text style={{ color: "#4a5b70" }}>{`冷却时间: ${skillData._cdMillis}`}</Text>
            </ImageBackground>
          </View>
        </View>
        {
          isShowIcon && (
            <View style={{ position: 'absolute', right: "10%", zIndex: 2, justifyContent: 'center' }}>
              <FastImage source={getBtnIcon(1).img} style={{ width: 40, height: 40 }} />
            </View>
          )
        }
      </ImageBackground>
      {/* <View style={[styles.skillContainer, { flexDirection: "row" }]}>
        <View>
          <FastImage source={getSkillIcon(skillData._iconId)} style={{ width: 100, height: 100 }} />
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View style={{ height: "33%", flexDirection: 'row', alignItems: 'center', justifyContent: "space-evenly" }}>
            <Text>{levelName}</Text>
            <Text>{skillData._name}</Text>
          </View>
          <View style={{ height: "33%", justifyContent: 'center', alignItems: 'center' }}>
            <Text>{skillData._desc}</Text>
          </View>
          <View style={{ height: "33%", flexDirection: 'row', alignItems: 'center', justifyContent: "space-evenly" }}>
            <Text>{skillData._consume[0].mp}</Text>
            <Text>{skillData._cdMillis}</Text>
          </View>
          {
            isShowIcon && (
              <View style={{ position: 'absolute', right: "10%", zIndex: 2, justifyContent: 'center' }}>
                <FastImage source={getBtnIcon(1).img} style={{ width: 40, height: 40 }} />
              </View>
            )
          }
        </View>
      </View> */}
    </TouchableOpacity>
  )
}


const SkillsList = props => {
  const { gongFaConfig, equipmentSkills, gongFaProgressData, equipmentIndex, onClose } = props;
  const gongFaList = gongFaProgressData.filter(item => item.haveSkills.length > 0)

  const timer = useRef(null)

  const handlerEquipmentSkill = (skill, gongFaId) => {
    if (++timer.current >= 2) { // 双击触发
      timer.current = 0;
      props.dispatch(action('GongFaModel/checkedGongFaSkill')({ equipmentIndex, skill, gongFaId })).then(() => {
        onClose()
      })
    }
    timer.current = setTimeout(() => {
      timer.current = 0;
    }, 500);
  }

  const _renderItem = ({ item }) => {
    const { levelName } = gongFaConfig.gongFaLevelData.find(f => {
      return f.gongFaId.find(id => id === item.gongFaId) != undefined
    })
    const gongFaName = gongFaConfig.gonFaData.find(f => f.gongFaId === item.gongFaId).name

    return (
      <View style={{ marginTop: 20 }}>
        <ImageBackground style={{ width: px2pd(401), height: px2pd(84), justifyContent: 'center', alignItems: 'center' }} source={require('../../../../assets/gongFa/skill/gongfa_name_bg.png')}>
          <Text style={{ color: "#3f597c", fontSize: 18 }}>{gongFaName}</Text>
        </ImageBackground>
        {/* <Text style={{ fontSize: 18, color: "#000" }}>功法名称: {gongFaName}</Text> */}
        {
          item.haveSkills.map(skill => (
            <View key={skill._id} style={{
              marginTop: 12,
            }}>
              <SkillDetail
                levelName={levelName}
                skillData={skill}
                onPress={() => { handlerEquipmentSkill(skill, item.gongFaId) }}
                isShowIcon={equipmentSkills.find(f => f._id === skill._id) != undefined ? true : false}
              />
            </View>
          ))
        }
      </View>
    )
  }

  return (
    <View style={styles.viewContainer}>
      <FastImage style={{ position: 'absolute', width: '100%', height: "100%" }} source={require('../../../../assets/gongFa/bg.png')} />
      <SafeAreaView style={{ flex: 1 }}>
        <FastImage style={{ width: px2pd(1056), height: px2pd(167) }} source={require('../../../../assets/gongFa/skill/skillCheck_title.png')} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <FlatList
            data={gongFaList}
            renderItem={_renderItem}
            keyExtractor={(item, index) => item.gongFaId + index}
          />
        </View>
        <View style={{ marginLeft: 12, alignItems: 'flex-start' }}>
          <ReturnButton onPress={onClose} />
        </View>
      </SafeAreaView>

    </View>
  );
};

export default connect(state => ({ ...state.GongFaModel }))(SkillsList);

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  skillContainer: {
    height: 100,
    width: "100%",
    borderColor: '#000',
    borderWidth: 1,
    overflow: 'hidden',
  },
});
