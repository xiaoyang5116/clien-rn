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
import { CheckBox, Icon } from '@rneui/themed';


const SkillPage = props => {
  const { allSkills } = props;

  const checkedSkill = (id, checked) => {
    props.dispatch(action('GongFaModel/checkedGongFaSkill')({ id, checked }));
  }

  const _renderSkills = ({ item }) => {
    return (
      <View style={{ justifyContent: 'center', borderBottomWidth: 1, borderColor: "#ccc" }}>
        <CheckBox
          title={item.name}
          textStyle={{ fontSize: 18, color: "#000" }}
          checked={item.isChecked}
          onPress={() => {
            checkedSkill(item.id, !item.isChecked)
          }}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {allSkills.length === 0 ? (
        <View>
          <Text>还没有获得技能</Text>
        </View>
      ) : (
        <FlatList data={allSkills} renderItem={_renderSkills} />
      )}
    </View>
  );
};

export default connect(state => ({ ...state.GongFaModel }))(SkillPage);

const styles = StyleSheet.create({});
