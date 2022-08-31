import React from 'react';
import Video from 'react-native-video';

import {
    View,
    StyleSheet,
} from 'react-native';

const ShiKongAnimation = (props) => {

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
                source={require('../../../assets/mp4/NIU_ZHUAN_SHI_KONG.mp4')}
                fullscreen={false}
                resizeMode={'stretch'}
                onEnd={() => { end() }}
            />
        </View>
    );
}

export default ShiKongAnimation;

const styles = StyleSheet.create({
    viewContainer: {
        width: '100%', 
        height: '100%', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.65)',
    },
});
