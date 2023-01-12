import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useRef } from 'react';

import { connect, action, getSkillIcon, getBtnIcon } from '../../../constants';
import FastImage from 'react-native-fast-image';
import { TextButton } from '../../../constants/custom-ui';


export const SkillDetail = (props) => {
  const { skillData, levelName, onPress, isShowIcon } = props

  return (
    <TouchableOpacity disabled={isShowIcon} onPress={onPress}>
      <View style={[styles.skillContainer, { flexDirection: "row" }]}>
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
      </View>
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
        <Text style={{ fontSize: 18, color: "#000" }}>功法名称: {gongFaName}</Text>
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
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <FlatList
              data={gongFaList}
              renderItem={_renderItem}
              keyExtractor={(item, index) => item.gongFaId + index}
            />
          </View>
          <View style={{ marginBottom: 20, marginTop: 12 }}>
            <TextButton title={"返回"} onPress={onClose} />
          </View>
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
  container: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12
  },
  skillContainer: {
    height: 100,
    width: "100%",
    borderColor: '#000',
    borderWidth: 1,
    overflow: 'hidden',
  },
});
