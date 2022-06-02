import React from 'react';
import PropTypes from 'prop-types';
import { DeviceEventEmitter } from 'react-native';

import Video from 'react-native-video';
import { EventKeys } from '../../constants';

const Sound = (props) => {
    const defaultSource = require('../../../assets/sound/bg.mp3');
    const refVideo = React.useRef(null);
    const background = (props.bgm == undefined || props.bgm);
    const [volume, setVolume] = React.useState(props.volume);

    React.useEffect(() => {
        const eventType = background ? EventKeys.SOUND_BG_VOLUME_UPDATE : EventKeys.SOUND_EFFECT_VOLUME_UPDATE;
        const listener = DeviceEventEmitter.addListener(eventType, (type, volume) => {
            setVolume(volume);
        });
        return () => {
            listener.remove();
        }
    }, []);

    return (
        <Video 
            ref={(ref) => refVideo.current = ref} 
            audioOnly={true} 
            source={(props.source != undefined) ? props.source : defaultSource} 
            repeat={background}
            volume={volume}
            />
    );
}

Sound.propTypes = {
    bgm: PropTypes.bool,
    volume: PropTypes.number,
    source: PropTypes.number,
};

Sound.defaultProps = {
    bgm: true,
    volume: 1,
};

export default Sound;