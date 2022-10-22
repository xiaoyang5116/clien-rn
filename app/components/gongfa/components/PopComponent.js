import { StyleSheet, Text, View, TouchableWithoutFeedback, Image } from 'react-native';
import React from 'react';

import RootView from '../../RootView';
import { getBtnIcon } from '../../../constants';
import { TextButton } from '../../../constants/custom-ui';
import Toast from '../../toast';
import XiuLianGongFa from '../xiuLianGongFa'

const PopComponent = props => {
  const { onClose, gongFa, currentGongFaProgress, message } = props;
  const { name, desc } = gongFa
  const { gongFaStatus, gongFaLayer, gongFaGrade } = currentGongFaProgress;

  const xiuLiangGongFa = () => {
    onClose()
    const key = RootView.add(
      <XiuLianGongFa
        gongFa={gongFa}
        currentGongFaProgress={currentGongFaProgress}
        onClose={() => { RootView.remove(key) }}
      />
    )
  }

  const GongFaDetail = () => {
    let content = <></>
    if (gongFaStatus === 0) {
      const isLingWu = message.every(item => item.isOK ? true : false)
      content = (
        <View style={{ paddingLeft: 12, paddingRight: 12, width: "100%", marginTop: 40 }}>
          <View style={{
            width: "100%",
            backgroundColor: "#E0E0E0",
            alignItems: 'center'
          }}>
            <View style={{ marginTop: 12 }}>
              <Text style={{ fontSize: 18 }}>激活条件及消耗</Text>
            </View>
            <View style={{ marginBottom: 20 }}>
              {message.map((item, index) => {
                const icon = getBtnIcon(item.isOK ? 1 : 6)
                return (
                  <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                    <Image source={icon.img} style={{ width: 30, height: 30 }} />
                    <Text style={{ marginLeft: 12, fontSize: 16, color: item.isOK ? "#000" : "#F34D4D" }}>{item.msg}</Text>
                  </View>
                )
              })}
            </View>
          </View>
          <View style={{ marginTop: 12, alignItems: 'center' }}>
            <TextButton title={"领悟"} onPress={() => {
              if (isLingWu) {
                xiuLiangGongFa()
              } else {
                Toast.show("条件不满足")
              }
            }} />
          </View>
        </View>
      )
    }

    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={styles.gongFaNameContainer}>
          <Text style={styles.gongFaName}>{name}</Text>
        </View>
        <View style={styles.gongFaDescContainer}>
          <Text style={styles.gongFaDesc}>{desc}</Text>
        </View>
        {content}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, zIndex: 99 }}>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={onClose}>
        <View style={styles.viewContainer}>
          <TouchableWithoutFeedback onPress={() => { }}>
            <View style={styles.contentContainer}>
              <GongFaDetail />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default PopComponent;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '90%',
    height: '60%',
    backgroundColor: '#ccc',
  },
  gongFaNameContainer: {
    width: '100%',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gongFaName: {
    fontSize: 24,
    color: '#000',
  },
  gongFaDescContainer: {
    width: "75%",
  },
  gongFaDesc: {
    fontSize: 16,
    color: "#000",
    textAlign: 'center',
    marginTop: 20
  },
});
