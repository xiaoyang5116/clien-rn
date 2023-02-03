import { FlatList, SafeAreaView, StyleSheet, Text, View, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import { action } from '../../../constants';
import { BtnIcon, ExitButton } from '../../button';
import { ImageButton, TextButton } from '../../../constants/custom-ui';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../../constants/resolution';

const BTN_STYLE = {
  width: px2pd(978),
  height: px2pd(154),
}

const FenZhiDialog = props => {
  const { onDialogCancel, actionMethod } = props;
  const { __sceneId, sections } = props.viewData;
  const [sectionsData, setSectionsData] = useState(null);

  useEffect(() => {
    for (let index = 0; index < sections.length; index++) {
      const item = sections[index];
      for (let i = 0; i < item.conditions.length; i++) {
        const e = item.conditions[i];
        e.__sceneId = __sceneId
        props.dispatch(action('SceneModel/testCondition')(e)).then(result => {
          e.isUnlock = result
        })
      }
    }
    setSectionsData(sections)
  }, []);

  const _renderFenZhi = ({ item }) => {
    const { title, content, conditions, btn } = item
    const disabled = conditions.every(e => e.isUnlock === undefined ? false : e.isUnlock)

    return (
      <ImageBackground
        style={{ marginTop: 18, width: px2pd(1080), height: px2pd(713) }}
        source={require('../../../../assets/dialog/fen_zhi/fenZhi_bg.png')}
      >
        <View style={{ height: px2pd(87), width: px2pd(290), justifyContent: "center", marginLeft: px2pd(140), alignItems: 'center' }}>
          <Text style={{ fontSize: 20, color: "#43648F" }}>{title}</Text>
        </View>
        <View style={{ paddingLeft: 12, paddingRight: 12, flex: 1 }}>
          <Text style={{ fontSize: 18, marginTop: 12, color: '#fff', marginBottom: 7 }}>{content}</Text>
          {conditions.map((condition, index) => {
            return (
              <View key={index} style={{
                height: 20,
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: 'center',
                marginTop: 12,
              }}>
                {condition.isUnlock === undefined
                  ? <View></View>
                  : <BtnIcon id={condition.isUnlock ? 15 : 16} style={{ position: 'relative' }} />
                }
                <Text style={{ marginLeft: 20, color: "#fff", fontSize: 16 }}>{condition.content}</Text>
              </View>
            )
          })}
        </View>
        <View style={{ justifyContent: 'center', alignItems: "center" }}>
          <ImageButton
            {...BTN_STYLE}
            disabled={!disabled}
            source={require('../../../../assets/dialog/fen_zhi/fenZhiBtn_bg1.png')}
            selectedSource={require('../../../../assets/dialog/fen_zhi/fenZhiBtn_bg2.png')}
            onPress={() => {
              actionMethod(btn[0])
              onDialogCancel();
            }}
          />
          <View pointerEvents='none' style={{ position: 'absolute', flexDirection: "row", justifyContent: "center", alignItems: "center", }}>
            {disabled ? null : <FastImage style={{ width: px2pd(61), height: px2pd(71), }} source={require('../../../../assets/dialog/fen_zhi/unlock.png')} />}
            <Text style={{ color: "#fff", fontSize: 18, marginLeft: disabled ? 0 : 4, }}>{btn[0].title}</Text>
          </View>
        </View>
      </ImageBackground>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <FastImage
        style={{ width: "100%", height: "100%", position: "absolute" }}
        source={require('../../../../assets/dialog/fen_zhi/bg.png')}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.viewContainer}>
          <FastImage
            style={{ width: px2pd(1039), height: px2pd(247) }}
            source={require('../../../../assets/dialog/fen_zhi/title_bg.png')}
          />
          <View style={{ flex: 1 }}>
            <FlatList
              data={sectionsData}
              renderItem={_renderFenZhi}
            />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, }}>
            <ExitButton onPress={onDialogCancel} />
            <ImageButton
              width={px2pd(217)}
              height={px2pd(220)}
              source={require('../../../../assets/dialog/fen_zhi/cunDan1.png')}
              selectedSource={require('../../../../assets/dialog/fen_zhi/cunDan2.png')}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default FenZhiDialog;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    // paddingLeft: 12,
    // paddingRight: 12,
  },
});
