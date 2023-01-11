import { StyleSheet, Text, View, FlatList, } from 'react-native';
import React from 'react';

import { connect, action } from '../../../constants';

const SkillsList = props => {
  const { gongFaConfig, equipmentSkills, gongFaProgressData, equipmentIndex, onClose } = props;
  // console.log("gongFaProgressData", gongFaProgressData);
  const skills = gongFaProgressData.filter(item => item.haveSkills.length > 0)

  const _renderItem = ({ item }) => {
    return (
      <View>
        <Text>{item.gongFaId}</Text>
      </View>
    )
  }
  return (
    <View style={styles.viewContainer}>
      <View style={styles.container}>
        <FlatList data={skills} renderItem={_renderItem} />
      </View>
    </View>
  );
};

export default connect(state => ({ ...state.GongFaModel }))(SkillsList);

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: "90%",
    height: "70%",
    backgroundColor: '#ccc',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 12,
  }
});
