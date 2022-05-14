import { range } from 'lodash';
import React from 'react';

import { 
    View, 
    Animated,
    Easing,
} from 'react-native';

import SpriteSheet from '../../components/SpriteSheet';

const TransAnimation = (props) => {
    const mummy = React.useRef(null);
    const scale = React.useRef(new Animated.Value(0.6)).current;
    
    React.useEffect(() => {
        const play = type => {
            mummy.current.play({
              type,
              fps: Number(3),
              loop: false,
              resetAfterFinish: false,
              onFinish: () => {
                Animated.timing(scale, {
                    toValue: 0.3,
                    duration: 1600,
                    easing: Easing.cubic,
                    useNativeDriver: false,
                }).start(() => {
                    setTimeout(() => {
                        if (props.onCompleted != undefined) { 
                            props.onCompleted(); 
                        }
                    }, 600);
                });
              }
            });
          };
          play('walk');
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Animated.View style={{ transform: [{ scale: scale }], borderWidth: 2, borderColor: '#333' }}>
              <SpriteSheet
                ref={ref => (mummy.current = ref)}
                source={require('../../../assets/animations/world_trans.png')}
                columns={1}
                rows={7}
                frameWidth={690}
                frameHeight={276}
                imageStyle={{}}
                animations={{
                  walk: range(7),
                }}
              />
            </Animated.View>
        </View>
    );
}

export default TransAnimation;