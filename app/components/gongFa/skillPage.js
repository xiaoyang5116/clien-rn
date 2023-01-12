import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import { connect, action } from '../../constants';
import RootView from '../RootView';

import { TextButton } from '../../constants/custom-ui';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SkillsList, { SkillDetail } from './components/SkillsList';

const AddSkillComponent = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={[styles.skillContainer, { justifyContent: "center", alignItems: "center" }]}>
        <AntDesign name="pluscircleo" color={'#000'} size={40} />
      </View>
    </TouchableOpacity>
  )
}

const SkillPage = props => {
  const { equipmentSkills, gongFaProgressData, gongFaConfig } = props;
  const [reload, setReload] = useState(false)

  const openSkillsList = (index) => {
    const key = RootView.add(
      <SkillsList
        equipmentIndex={index}
        onClose={() => {
          RootView.remove(key)
          setReload(!reload)
        }}
      />
    )
  }

  const _renderSkills = ({ item, index }) => {
    if (item.isUnlock) {
      if (item._id === undefined) {
        return <AddSkillComponent onPress={() => { openSkillsList(index) }} />
      } else {
        const { levelName } = gongFaConfig.gongFaLevelData.find(f => {
          return f.gongFaId.find(id => id === item.gongFaId) != undefined
        })
        return (
          <View style={{ marginTop: 24 }}>
            <SkillDetail
              levelName={levelName}
              skillData={item}
              onPress={() => { openSkillsList(index) }}
              isShowIcon={false}
            />
          </View>
        )
      }
    } else {
      return (
        <View style={styles.skillContainer}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: "center" }}>
            <Text style={{ fontSize: 18, color: "#000" }}>未解锁</Text>
          </View>
        </View>
      )
    }

  };

  return (
    <View style={{ flex: 1, paddingLeft: 12, paddingRight: 12 }}>
      <Text style={{ marginTop: 12, fontSize: 20, color: '#000' }}>
        装备的技能
      </Text>
      <View>
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
    width: "100%",
    borderColor: '#000',
    borderWidth: 1,
    marginTop: 24,
  },
});
