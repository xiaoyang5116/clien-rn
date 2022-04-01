import React from 'react'
import { Button, Text, View, TouchableWithoutFeedback, } from '../../constants/native-ui';


const BlackNarration = (props) => {
  const currentStyles = props.currentStyles;
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
            <Button title='>>>' onPress={props.onAsideNext} color={currentStyles.button.color} />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default BlackNarration;
