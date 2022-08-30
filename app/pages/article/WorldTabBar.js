import React from 'react';
import lo from 'lodash';

import { View, Text, DeviceEventEmitter } from 'react-native';
import { EventKeys } from '../../constants';

const WorldTabBar = (props) => {
    const { state, descriptors } = props;
    const routeKey = state.routes[state.index].key;
    const descriptor = descriptors[routeKey];
    const { options } = descriptor;
  
    const [barLabel, setBarLabel] = React.useState(options.tabBarLabel);
  
    React.useEffect(() => {
      if (!lo.isEqual(descriptor.route.name, 'PrimaryWorld'))
        return
  
        const listener = DeviceEventEmitter.addListener(EventKeys.SET_CURRENT_WORLD, (world) => {
          if (!lo.isEmpty(world.name)) {
            setBarLabel(world.name);
          } else {
            setBarLabel(options.tabBarLabel);
          }
        });
        return () => {
          listener.remove();
        }
    }, []);
  
    return (
      <View style={{ paddingTop: 5, paddingBottom: 5, paddingRight: 20, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, color: '#333' }}>{barLabel}</Text>
      </View>
    );
}

export default WorldTabBar;