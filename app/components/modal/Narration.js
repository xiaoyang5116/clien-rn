import React from 'react'
import { StyleSheet } from 'react-native';
import { TextButton } from '../../constants/custom-ui';
import { Button, Text, View, TouchableWithoutFeedback, } from '../../constants/native-ui';


const BlackNarration = (props) => {
  const currentStyles = props.currentStyles;
  const label = '>>>';

  return (
    <TouchableWithoutFeedback onPress={props.onAsideNext}>
      <View style={[currentStyles.asideCenter]}>
        <View style={[currentStyles.asideParent2]}>
          <View style={currentStyles.asideTitleContainer}>
            <Text style={currentStyles.asideTitle}>{props.title}</Text>
          </View>
          <View style={currentStyles.asideContentContainer}>
            <Text style={currentStyles.asideContent}>{props.content}</Text>
          </View>
        </View>
        <View style={currentStyles.asideBottomContainer}>
          <View style={[currentStyles.asideBottomBanner, { backgroundColor: currentStyles.button.backgroundColor }]}>
            {/* <Button title='@@@>>>' onPress={props.onAsideNext} color={currentStyles.button.color} /> */}
            <TouchableWithoutFeedback onPress={props.onAsideNext}>
              <View style={[styles.buttonView, { backgroundColor: currentStyles.button.color }]}><Text style={styles.buttonText}>{label}</Text></View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  buttonView: {
    justifyContent: 'center', 
    alignItems: 'center', 
    height: 35,
  },

  buttonText: {
    color: '#fff',
  },
});

export default BlackNarration;
