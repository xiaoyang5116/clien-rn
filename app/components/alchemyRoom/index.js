import React from 'react'
import { Dimensions, View, Text } from 'react-native';

import RootView from '../RootView';
import Transitions from '../transition';
import AlchemyRoom from './AlchemyRoom';
import GuidePage from '../GuidePage';
import { TextButton } from '../../constants/custom-ui';


const { width } = Dimensions.get('window');

class AlchemyRoomModal {
  static show(isOpenBoot = false) {
    const key = RootView.add(
      <Transitions
        id={'OPEN_LIAN_DAN'}
        onCompleted={() => {
          if (isOpenBoot) {
            const guideKey = RootView.add(
              <GuidePage onClose={() => { RootView.remove(guideKey); }}>
                <View style={{ width }}>
                  <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'tomato', opacity: 0.5 }}>
                    <Text style={{ fontSize: width * 0.5, textAlign: 'center' }}>1</Text>
                  </View>
                </View>
                <View style={{ width }}>
                  <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'thistle', opacity: 0.5 }}>
                    <Text style={{ fontSize: width * 0.5, textAlign: 'center' }}>2</Text>
                  </View>
                </View>
              </GuidePage>
            )
          }
        }}>
        <AlchemyRoom onClose={() => { RootView.remove(key); }} />
      </Transitions>
    );
  }
}

export default AlchemyRoomModal
