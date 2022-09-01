import React from 'react';
import lo from 'lodash';

import { TouchableWithoutFeedback, View, Text, StyleSheet } from 'react-native';
import { action } from '../../constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import readerStyle from '../../themes/readerStyle';

const DarkLightSelector = (props) => {

    const darkMode = React.useRef(lo.isEqual(props.readerStyle.bgColor, readerStyle.matchColor_7.bgColor));
  
    const onChanged = (e) => {
      if (!darkMode.current) {
        props.dispatch(action('ArticleModel/changeReaderStyle')(readerStyle.matchColor_7));
        darkMode.current = true;
      } else {
        props.dispatch(action('ArticleModel/changeReaderStyle')(readerStyle.matchColor_1));
        darkMode.current = false;
      }
    }
  
    const button = darkMode.current
      ? <FontAwesome name={'moon-o'} color={"#111"} size={23} /> : <Fontisto name={'day-sunny'} color={"#111"} size={23} />
    const text = darkMode.current
      ?  <Text style={styles.bannerButtonText}>夜间模式</Text> :  <Text style={styles.bannerButtonText}>白天模式</Text>
  
    return (
    <TouchableWithoutFeedback onPress={onChanged}>
      <View style={styles.bannerButton}>
        {button}
        {text}
      </View>
    </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    bannerButtonText: {
        marginTop: 10,
        color: '#000',
        fontSize: 12,
    },
    bannerButton: {
        width: 55,
        marginLeft: 2, 
        marginRight: 2,
        marginTop: 10,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }, 
});

export default DarkLightSelector;