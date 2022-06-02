import React from 'react';
import PropTypes from 'prop-types';
import { View, DeviceEventEmitter } from 'react-native';

import lo from 'lodash';
import Video from 'react-native-video';
import { EventKeys, connect } from '../../constants';

const SOUNDS_MAP = [
    { id: '1', source: require('../../../assets/sound/bg.mp3') },
    { id: '2', source: require('../../../assets/sound/bg2.mp3') },
];

const Sound = (props) => {
    const refVideo = React.useRef(null);
    const [volume, setVolume] = React.useState(props.volume);
    const [fadeOut, setFadeOut] = React.useState(false);

    if (props.isBGM) {
        // 监听渐隐消息
        React.useEffect(() => {
            const listener = DeviceEventEmitter.addListener('__@Sound.fadeOutBGM', () => {
                setFadeOut(true);
            })
            return () => {
                listener.remove();
            }
        }, []);

        // 声音渐隐处理
        React.useEffect(() => {
            if (fadeOut && volume > 0) {
                setTimeout(() => {
                    setVolume(v => {
                        v -= 0.1;
                        return (v < 0.1) ? 0 : v;
                    });
                }, 100);
            }
        }, [volume, fadeOut]);

        // 渐隐消失后通知下一个BGM
        if (fadeOut && volume <= 0) {
            DeviceEventEmitter.emit('__@Sound.nextBGM');
            console.debug(`BGM fadeOut, SoundId=${props.soundId}`);
        }
    }

    return (
        <Video 
            ref={(ref) => refVideo.current = ref} 
            audioOnly={props.audioOnly} 
            source={props.source}
            repeat={props.repeat}
            volume={volume}
            />
    );
}

Sound.propTypes = {
    soundId: PropTypes.string,
    audioOnly: PropTypes.bool,
    repeat: PropTypes.bool,
    volume: PropTypes.number,
    source: PropTypes.number,
};

Sound.defaultProps = {
    audioOnly: true,
    repeat: true,
    volume: 1,
};

const SoundProvider = (props) => {
    const uniqueKey = React.useRef(0);
    const bgmPendingQueue = React.useRef([]);
    const playingBGM = React.useRef(null);
    const [bgmViews, setBGMViews] = React.useState([]);

    const playBGM = () => {
        const lastBGM = bgmPendingQueue.current.pop();
        bgmPendingQueue.current.length = 0;

        if (lastBGM == undefined) {
            playingBGM.current = null;
            return;
        }

        const { soundId } = lastBGM;
        const source = SOUNDS_MAP.find(e => lo.isEqual(e.id, soundId)).source;
        const so = <Sound key={lastBGM.key} soundId={soundId} isBGM={true} audioOnly={true} repeat={true} volume={1} source={source} />;

        playingBGM.current = soundId;
        setTimeout(() => {
            setBGMViews((_list) => {
                return [so]; // 同一时刻仅有一个BGM播放
            });
            console.debug(`BGM Play, SoundId=${soundId}`);
        }, 0);
    }

    const fadeOutBGMAndPlayNext = () => {
        DeviceEventEmitter.emit('__@Sound.fadeOutBGM');
    }

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener(EventKeys.SOUND_BGM_PLAY, ({ soundId }) => {
            bgmPendingQueue.current.push({ key: uniqueKey.current++, soundId});

            if (playingBGM.current == null) {
                playBGM(); // 首次播放BGM
            } else if (lo.isEqual(soundId, playingBGM.current)) {
                return; // 播放重复背景音乐不打断
            } else {
                fadeOutBGMAndPlayNext();
            }
        });
        return () => {
            listener.remove();
        }
    }, []);

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener('__@Sound.nextBGM', () => {
            playBGM();
        });
        return () => {
            listener.remove();
        }
    }, []);

    return (<View>{bgmViews}</View>);
}

export default connect((state) => ({ ...state.SoundModel }))(SoundProvider);