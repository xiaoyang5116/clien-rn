
import React from 'react';
import { DeviceEventEmitter } from 'react-native';
import RootView from '../components/RootView';
import { EventKeys } from '../constants';
import FragmentPage from './prop/FragmentPage';

// 此处存放全局View监听器
const ViewListeners = (props) => {

  // 碎片确认弹窗
  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener(EventKeys.GET_FRAGMENT_PROP, ({ fragment, toPropConfig }) => {
      const key = RootView.add(<FragmentPage fragment={fragment} toPropConfig={toPropConfig} onClose={() => {
        RootView.remove(key);
      }} />);
    });
    return () => {
      listener.remove();
    }
  }, []);

  return (
    <></>
  )
}

export default ViewListeners;