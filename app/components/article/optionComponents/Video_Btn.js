import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../../constants/resolution';
import { ImageButton, BtnIcon, ImageBtn } from '../../../constants/custom-ui';
import ButtonClickEffects from '../../animation/buttonClickEffects';

const Video_Btn = props => {
  const { title, disabled, onPress, currentStyles, optionData, containerStyle } =
    props;
  const { icon } = optionData;
  const btnAnimateRef = React.createRef();

  const handlerPress = () => {
    if (
      props.onPress != undefined &&
      !props.disabled &&
      props.sourceType === 'reader'
    ) {
      return btnAnimateRef.current.start();
    }
    if (props.sourceType != 'reader') {
      onPress();
    }
  };

  if (disabled) {
    return (
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          overflow: 'hidden',
          justifyContent: 'center',
        }}>
        <View style={{ borderColor: '#666', borderWidth: 1, borderRadius: 3, padding: 1 }}>
          <ImageBackground
            style={{
              width: px2pd(1010),
              height: px2pd(96),
              alignItems: 'center',
              justifyContent: 'center',
            }}
            source={require('../../../../assets/button/video_btn_disabled.png')}>
            {icon?.show ? (
              <BtnIcon
                id={icon.id}
                style={{ height: '100%', justifyContent: 'center' }}
              />
            ) : null}
            <Text style={{ fontSize: 14, color: '#000' }}>{title}</Text>
          </ImageBackground>
        </View>
      </View>
    );
  }

  return (
    <View style={{ width: '100%', alignItems: 'center', overflow: 'hidden' }}>
      <View style={{ borderColor: '#666', borderWidth: 1, borderRadius: 3, padding: 1 }}>
        <ImageBtn
          imgStyle={{ width: px2pd(1010), height: px2pd(96) }}
          onPress={handlerPress}
          disabled={disabled}
          source={require('../../../../assets/button/video_btn.png')}
          selectedSource={require('../../../../assets/button/video_btn_2.png')}>
          {icon?.show ? (
            <BtnIcon
              id={icon.id}
              style={{ height: '100%', justifyContent: 'center' }}
            />
          ) : null}
          <ButtonClickEffects
            ref={btnAnimateRef}
            onPress={onPress}
            btnAnimateId={props.btnAnimateId}
          />
          <Text style={{ fontSize: 14, color: '#000' }}>{title}</Text>
        </ImageBtn>
      </View>
    </View>
  );
};

export default Video_Btn;

const styles = StyleSheet.create({});
