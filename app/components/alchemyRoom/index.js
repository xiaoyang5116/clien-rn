import React from 'react'

import RootView from '../RootView';
import Transitions from '../transition';
import AlchemyRoom from './AlchemyRoom';

class AlchemyRoomModal {
  static show(isOpenBoot = false) {
    const key = RootView.add(
      <Transitions id={'OPEN_LIAN_DAN'}>
        <AlchemyRoom onClose={() => { RootView.remove(key); }} isOpenBoot={isOpenBoot} />
      </Transitions>
    );
  }
}

export default AlchemyRoomModal
