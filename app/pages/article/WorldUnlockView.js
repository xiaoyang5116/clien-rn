import React from 'react';
import lo from 'lodash';

import { View, Text, TouchableWithoutFeedback } from 'react-native';

const WorldUnlockView = (props) => {

    const back = () => {
      props.navigation.navigate('PrimaryWorld');
      props.onClose();
    }
  
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <View style={{ 
          width: '80%', 
          height: 150, 
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          backgroundColor: '#fff', 
          borderWidth: 1, 
          borderColor: '#ddd',
          shadowColor: "#0d152c",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.4,
          shadowRadius: 6, }}>
            <Text style={{ fontSize: 24, color: '#000' }}>当前世界未解锁</Text>
            <TouchableWithoutFeedback onPress={back}>
              <View style={{ width: 130, height: 30, borderWidth: 1, borderColor: '#bbb', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#000' }}>返回</Text>
              </View>
            </TouchableWithoutFeedback>
        </View>
      </View>
    );
}

export default WorldUnlockView;