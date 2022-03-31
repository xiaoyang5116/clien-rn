import React from 'react'
import { Button, Text, View, TouchableWithoutFeedback } from '../../constants/native-ui';
import { getWindowSize } from '../../constants';

const size = getWindowSize();


const BlackNarration = (props) => {
  const currentStyles = props.currentStyles;
  return (
    <View style={{ flex: 1, width: '100%', paddingLeft: 16, paddingRight: 16, justifyContent: 'flex-end', flexDirection: 'column', }}>
      <View style={{ justifyContent: 'flex-end', width: '100%' }}>
        <TouchableWithoutFeedback onPress={props.onAsideNext}>
          <View style={[currentStyles.asideParent1, { opacity: 0.88, borderColor: "#2c3e50", borderWidth: 2, }]}>
            {
              (props.title != undefined) && (props.title != '') && (
                <View style={currentStyles.asideTitleContainer}>
                  <Text style={currentStyles.asideTitle1}>{props.title}</Text>
                </View>
              )
            }
            <View style={currentStyles.asideContentContainer}>
              <Text style={currentStyles.asideContent1}>{props.content}</Text>
            </View>
            {/* <View style={currentStyles.asideBottomContainer}>
            <View style={[currentStyles.asideBottomBanner, { backgroundColor: currentStyles.button.backgroundColor }]}>
              <Button title='>>>' onPress={props.onAsideNext} color={currentStyles.button.color} />
            </View>
          </View> */}
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={{ height: '25%' }}></View>
    </View>

  );
}

export default BlackNarration;

