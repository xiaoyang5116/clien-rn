import React from 'react';
import lo from 'lodash';

import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import LightBlurView from '../../components/extends/LightBlurView';

const WorldUnlockView = (props) => {

    const back = () => {
      props.navigation.navigate('PrimaryWorld');
      props.onClose();
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LightBlurView inner={true} style={{ borderRadius: 4, width: '90%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.viewStyle}>
                <Text style={{ fontSize: 22, color: '#000', marginLeft: 10, marginRight: 10, lineHeight: 30 }}>{lo.isEmpty(props.content) ? '当前世界未解锁' : props.content}</Text>
                <TouchableWithoutFeedback onPress={back}>
                  <View style={{ width: 180, height: 36, borderWidth: 1, marginTop: 10, borderColor: 'rgba(128,128,128,0.4)', backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: '#000' }}>返回</Text>
                  </View>
                </TouchableWithoutFeedback>
            </View>
          </LightBlurView>
      </View>
    );
}

const styles = StyleSheet.create({
  viewStyle: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',

    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 4,

    paddingTop: 20, 
    paddingBottom: 20,
    paddingLeft: 5,
    paddingRight: 5,
  }
});

export default WorldUnlockView;