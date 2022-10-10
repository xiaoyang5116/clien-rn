import React from 'react';
import lo from 'lodash';

import { Text, DeviceEventEmitter, Animated, StyleSheet, Platform } from 'react-native';
import { EventKeys, statusBarHeight } from '../../constants';

const WorldTabBar = (props) => {
    const { state, descriptors } = props;
    const routeKey = state.routes[state.index].key;
    const descriptor = descriptors[routeKey];
    const { options } = descriptor;
  
    const [barLabel, setBarLabel] = React.useState(options.tabBarLabel);
    const opacity = React.useRef(new Animated.Value(1)).current;
  
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

    React.useEffect(() => {
      if (lo.isEqual(descriptor.route.name, 'LeftWorld') || lo.isEqual(descriptor.route.name, 'RightWorld')) {
        opacity.setValue(0)
      } else {
        opacity.setValue(1);
      }
    }, [props]);
  
    return (
      <Animated.View style={[styles.viewContainer, { opacity: opacity }, { marginTop: (Platform.OS == 'ios' ? statusBarHeight : 0), marginBottom: (Platform.OS == 'ios' ? 20 : 0) }]} pointerEvents='none'>
        <Text style={{ fontSize: 20, color: '#333' }}>{barLabel}</Text>
      </Animated.View>
    );
}

const styles = StyleSheet.create({
  viewContainer: {
    position: 'absolute',
    right: 0,
    paddingTop: 5, 
    paddingBottom: 5, 
    paddingRight: 20, 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems: 'center'
  }
})

export default WorldTabBar;