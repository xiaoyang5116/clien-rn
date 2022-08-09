import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import {
  action,
  connect,
  Component,
  ThemeContext,
  EventKeys,
} from "../../constants";
  
import { 
  Text, 
  View, 
  Image,
  SectionList, 
  TouchableWithoutFeedback 
} from '../../constants/native-ui';

import lo from 'lodash';
import { px2pd } from '../../constants/resolution';
import AntDesign from 'react-native-vector-icons/AntDesign';

const BoxItem = (props) => {
  return (
    <View style={[props.style, styles.boxItem]}>

    </View>
  );
}

const MissionBar = (props) => {

  const boxItems = [];
  lo.range(28).forEach(e => {
    boxItems.push(<BoxItem key={e} style={(e <= 1) ? { marginLeft: 10 } : {}} />);
  });

  return (
      <View style={{ position: 'absolute', bottom: 40, width: '100%', height: px2pd(320), backgroundColor: '#a49f99', zIndex: 100 }}>
        <View style={{ position: 'absolute', right: 5, top: -25 }}>
          <AntDesign name='close' size={25} onPress={() => {
            if (props.onClose != undefined) {
              props.onClose();
            }
          }} />
        </View>
        <ScrollView horizontal={true} pagingEnabled={true} showsHorizontalScrollIndicator={false} style={{  }}>
          <View style={{ flexWrap: 'wrap' }}>
            {boxItems}
          </View>
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  boxItem: {
    width: px2pd(120), 
    height: px2pd(120), 
    marginRight: 10, 
    marginTop: 10, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 10, 
    backgroundColor: '#666',
  }
});

export default MissionBar;