import React from 'react'
import { View, Text, ImageBackground, Image, Animated, TouchableOpacity, Button } from 'react-native';
import GameOverModal from '../components/GameOverModal'
import { connect } from "../constants";

const GameOverPage = (props) => {
  const currentStyles = props.currentStyles;
  function back() {
    props.navigation.navigate('First')
  }
  return (
    <View style={currentStyles.gameOverPage}>
      <GameOverModal style={currentStyles} name={"1234"} back={back} />
    </View>
  )
}

export default connect((state) => ({ ...state.AppModel }))(GameOverPage)
