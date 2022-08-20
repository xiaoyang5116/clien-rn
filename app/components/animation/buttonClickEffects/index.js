import { StyleSheet, Text, View, Animated } from 'react-native'
import React, { PureComponent, useRef } from 'react'

import { BUTTON_CLICK_ANIMATE_DATA } from './config'
import lo from 'lodash';

import SpriteSheet from '../../SpriteSheet';


function getImgData(btnAnimateId) {
  if (btnAnimateId === undefined) return BUTTON_CLICK_ANIMATE_DATA[0]

  return BUTTON_CLICK_ANIMATE_DATA.find(item => item.id === btnAnimateId);
}

class ButtonClickEffects extends PureComponent {
  constructor(props) {
    super(props);
    this.sheet = React.createRef(null);
    this.opacity = new Animated.Value(0);
    this.imgData = getImgData(this.props.btnAnimateId)
  }

  start() {
    const play = type => {
      this.sheet.current.play({
        type,
        fps: Number(this.imgData.fps),
        resetAfterFinish: false,
        loop: false,
        onFinish: () => {
          this.opacity.setValue(0);
          if (this.props.onPress !== undefined) {
            this.props.onPress()
          }
        },
      });
    }

    this.opacity.setValue(1);
    play('walk');
  }

  render() {
    const { data } = this.imgData
    return (
      <Animated.View style={{ position: "absolute", opacity: this.opacity }}>
        <SpriteSheet
          ref={ref => (this.sheet.current = ref)}
          source={data[0].source}
          columns={data[0].columns}
          rows={data[0].rows}
          frameWidth={data[0].frameWidth}
          frameHeight={data[0].frameHeight}
          imageStyle={{}}
          viewStyle={{}}
          animations={{
            walk: lo.range(data[0].frameNums),
          }}
        />
      </Animated.View>
    )
  }
}

export default ButtonClickEffects

const styles = StyleSheet.create({})