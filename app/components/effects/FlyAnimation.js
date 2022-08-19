import React from 'react';
import Video from 'react-native-video';
import lo from 'lodash';

import {
    Animated,
    View,
    StyleSheet,
} from 'react-native';

const FlyAnimation = (props) => {

    const refVideo = React.useRef(null);

    React.useEffect(() => {
        refVideo.current.seek(0);
    }, []);

    const end = () => {
        if (props.onClose != undefined) {
            props.onClose();
        }
    }

    return (
        <View style={styles.viewContainer}>
            <Video 
                style={{ width: '100%', height: '100%' }}
                ref={(ref) => refVideo.current = ref}
                source={require('../../../assets/mp4/FLY_480x960.mp4')}
                fullscreen={false}
                resizeMode={'stretch'}
                onEnd={() => { end() }}
                onProgress={(p) => {
                    if (p.currentTime >= 3.25) {
                        end();
                    }
                }}
            />
        </View>
    );
}

export default FlyAnimation;

const styles = StyleSheet.create({
    viewContainer: {
        width: '100%', 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.65)',
    },
});
