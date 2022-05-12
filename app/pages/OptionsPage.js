
import React from 'react';
import { TextButton } from '../constants/custom-ui';

import {
  SafeAreaView
} from '../constants/native-ui';

import { View } from '../constants/native-ui';
import StoryTabPage from './home/StoryTabPage';

const OptionsPage = (props) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(255,255,255,1)' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: '100%', marginRight: 20, justifyContent: 'center', alignItems: 'flex-end' }}>
            <TextButton style={{ width: 100 }} title={'退出'} onPress={() => {
                props.onClose();
              }} />
        </View>
        <StoryTabPage />
      </View>
    </SafeAreaView>
  );
}

export default OptionsPage;