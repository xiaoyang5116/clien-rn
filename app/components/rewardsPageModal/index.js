import React from 'react';
import { View } from 'react-native';

import RootView from '../RootView';
import GridRewardsPage from './GridRewardsPage';


class RewardsPageModal {
  static gridRewards(payload) {
    const key = RootView.add(
      <GridRewardsPage data={payload} onClose={() => { RootView.remove(key); }} />
    )
  }
}

export default RewardsPageModal;