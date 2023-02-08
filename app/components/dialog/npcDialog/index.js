import { FlatList, StyleSheet, Text, View, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';

import { action, getBustImg } from '../../../constants';
import { px2pd, SCALE_FACTOR } from '../../../constants/resolution';

import FastImage from 'react-native-fast-image';
import { TextButton, BtnIcon, ImageButton } from '../../../constants/custom-ui';


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
      <View style={{ marginTop: 8, justifyContent: 'center', alignItems: 'center' }}>
        <ImageButton
          width={px2pd(709)}
          height={px2pd(70)}
          source={require('../../../../assets/dialog/npc/btn_1.png')}
          selectedSource={require('../../../../assets/dialog/npc/btn_2.png')}
          onPress={() => handlerOnPress(item)}
        />
        <View pointerEvents="none" style={{ position: 'absolute', }}>
          <Text style={{ color: '#656564' }}>{item.title}</Text>
        </View>
      </View>
    )
  }

  const renderFooter = () => {
    return (
      <View style={{ marginTop: 8, justifyContent: 'center', alignItems: 'center' }}>
        <ImageButton
          width={px2pd(709)}
          height={px2pd(70)}
          source={require('../../../../assets/dialog/npc/btn_1.png')}
          selectedSource={require('../../../../assets/dialog/npc/btn_2.png')}
          onPress={onDialogCancel}
        />
        <View pointerEvents="none" style={{ position: 'absolute', }}>
          <Text style={{ color: '#656564' }}>关闭</Text>
        </View>
      </View>
    )
  }

  if (npcData != null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ImageBackground
          source={require('../../../../assets/dialog/npc/bg.png')}
          style={styles.popContainer}
        >
          <FastImage
            style={{ position: "absolute", right: -px2pd(140), top: -px2pd(70), width: px2pd(334), height: px2pd(219) }}
            source={require('../../../../assets/dialog/npc/right_top.png')}
          />
          <View style={styles.headerContainer}>
            <View>
              <FastImage
                style={{ width: px2pd(265), height: px2pd(354), }}
                source={getBustImg(npcData.avatarId)} />
            </View>
            <View style={{ marginLeft: 12, marginBottom: 12 }}>
              <Text style={{ fontSize: 20, color: "#617778" }}>{npcData.name}</Text>
            </View>
            <View style={{ position: "absolute", right: 8, top: 18 }}>
              <Text style={{ textAlign: 'right', fontSize: 18, color: "#6b8e8f" }}>{duanWei}</Text>
              <Text style={{ textAlign: 'right', fontSize: 16, color: "#e75555" }}>{npcData.address}<Text style={{ color: npcData.color ? npcData.color : "#000" }}>{npcData.hao_gan_du}</Text></Text>
            </View>
          </View>

          <View style={styles.contentContainer}>
            <ImageBackground
              source={require('../../../../assets/dialog/npc/content_bg.png')}
              style={{ width: px2pd(709), height: px2pd(361), paddingLeft: 12, paddingRight: 12, paddingTop: 12, paddingBottom: 12 }}
            >
              <Text style={{ fontSize: 16 }}>{sections.content}</Text>
            </ImageBackground>

            <View style={{ marginBottom: 20, marginTop: 12 }}>
              <FlatList
                data={btnData}
                renderItem={renderBtn}
                keyExtractor={(item, index) => item.title + index}
                ListFooterComponent={renderFooter}
              />
            </View>
          </View>
          <FastImage
            style={{ position: "absolute", left: -px2pd(80), bottom: -px2pd(140), width: px2pd(326), height: px2pd(262) }}
            source={require('../../../../assets/dialog/npc/left_bottom.png')}
          />
        </ImageBackground>
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
    height: px2pd(1137),
    width: px2pd(806),
    paddingLeft: 12,
    paddingRight: 12,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    height: px2pd(279),
  },
  contentContainer: {
    marginTop: 12,
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center"
  }
});
