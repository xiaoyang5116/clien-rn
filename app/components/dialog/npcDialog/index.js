import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import { action, changeAvatar } from '../../../constants';
import { px2pd, SCALE_FACTOR } from '../../../constants/resolution';

import FastImage from 'react-native-fast-image';
import { TextButton, BtnIcon } from '../../../constants/custom-ui';

const NpcDialog = props => {
  const { onDialogCancel, actionMethod } = props
  const { __sceneId, sections, duanWei } = props.viewData;
  const [npcData, setNpcData] = useState(null)
  const [btnData, setBtnData] = useState(sections.btn)

  useEffect(() => {
    props
      .dispatch(action('SceneModel/getNpcData')({ sceneId: __sceneId }))
      .then(result => {
        if (result != undefined && result != null) {
          setNpcData(result);
        }
      });
  }, []);

  const handlerOnPress = (item) => {
    if (item.dialogs != undefined) {
      actionMethod(item);
    } else {
      onDialogCancel();
      actionMethod(item);
    }
  }

  const renderBtn = ({ item }) => {
    return (
      <View style={{ marginTop: 8, justifyContent: 'center' }}>
        <TextButton
          title={item.title}
          onPress={() => handlerOnPress(item)}
        />
      </View>
    )
  }

  const renderFooter = () => {
    return (
      <View style={{ marginTop: 8, justifyContent: 'center' }}>
        <TextButton
          title={"关闭"}
          onPress={() => {
            onDialogCancel();
          }}
        />
      </View>
    )
  }

  if (npcData != null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.popContainer}>
          <View style={styles.headerContainer}>
            <View>
              <FastImage
                style={{ width: 60, height: 60, overflow: "hidden", borderRadius: 30 }}
                source={changeAvatar(npcData.avatarId)} />
            </View>
            <View>
              <Text>{npcData.name}</Text>
            </View>
            <View>
              <Text style={{ textAlign: 'center' }}>{duanWei}</Text>
              <Text>{npcData.address}<Text style={{ color: npcData.color ? npcData.color : "#000" }}>{npcData.hao_gan_du}</Text></Text>
            </View>
          </View>

          <View style={styles.contentContainer}>
            <Text style={{ fontSize: 16 }}>{sections.content}</Text>
            <View style={{ marginBottom: 20 }}>
              <FlatList
                data={btnData}
                renderItem={renderBtn}
                keyExtractor={(item, index) => item.title + index}
                ListFooterComponent={renderFooter}
              />
            </View>
          </View>
        </View>
      </View >
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.popContainer}>
      </View>
    </View >
  )
};

export default NpcDialog;

const styles = StyleSheet.create({
  popContainer: {
    height: 400,
    width: 300,
    backgroundColor: "#eee",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 12,
    paddingBottom: 12
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentContainer: {
    marginTop: 12,
    flex: 1,
    justifyContent: "space-between"
  }
});
