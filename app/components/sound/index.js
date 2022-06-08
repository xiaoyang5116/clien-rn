import React from 'react';
import PropTypes from 'prop-types';
import { View, DeviceEventEmitter } from 'react-native';

import lo from 'lodash';
import Video from 'react-native-video';
import { EventKeys, connect } from '../../constants';
import { SOUNDS_CONFIG } from './config';

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
        }
    }

    React.useEffect(() => {
        const bgmListener = DeviceEventEmitter.addListener(EventKeys.SOUND_BG_VOLUME_UPDATE, ({ type, volume }) => {
            if (props.isBGM && lo.isEqual(type, props.type)) {
                setVolume(volume);
            }
        });
        const efmListener = DeviceEventEmitter.addListener(EventKeys.SOUND_EFFECT_VOLUME_UPDATE, ({ type, volume }) => {
            if (!props.isBGM && lo.isEqual(type, props.type)) {
                setVolume(volume);
            }
        });
        return () => {
            bgmListener.remove();
            efmListener.remove();
        }
    }, []);

    React.useEffect(() => {
        if (props.seek > 0) {
            refVideo.current.seek(props.seek);
        }
    }, []);

    return (
        <Video 
            ref={(ref) => refVideo.current = ref} 
            audioOnly={props.audioOnly} 
            source={props.source}
            repeat={props.repeat}
            volume={volume}
            onEnd={() => {
                if (props.onEnd != undefined) props.onEnd({ id: props.id, soundId: props.soundId });
            }}
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
    const effectPendingRemoveQueue = React.useRef([]);
    const playingBGM = React.useRef(null);
    const volumeState = React.useRef({});
    const [bgmViews, setBGMViews] = React.useState([]);
    const [effectViews, setEffectViews] = React.useState([]);

    // 同步至ref引用的状态变量，以便在副作用方法里面拿到最新值。
    volumeState.current = { 
        masterVolume: props.masterVolume,
        readerVolume: props.readerVolume,
    };

    const effectOnEnd = ({ id, soundId }) => {
        effectPendingRemoveQueue.current.push(id);
    }

    const playBGM = () => {
        const lastBGM = bgmPendingQueue.current.pop();
        bgmPendingQueue.current.length = 0;

        if (lastBGM == undefined) {
            playingBGM.current = null;
            return;
        }

        // type: 主音，副音（阅读器）
        // soundId: 声音ID
        const { type, soundId, seek } = lastBGM;
        const source = SOUNDS_CONFIG.find(e => lo.isEqual(e.id, soundId)).source;
        const volumeSettings = volumeState.current[type];
        const so = <Sound key={lastBGM.key} id={lastBGM.key} type={type} seek={seek} soundId={soundId} isBGM={true} audioOnly={true} repeat={true} volume={volumeSettings.bg} source={source} />;

        playingBGM.current = soundId;
        setTimeout(() => {
            setBGMViews((_list) => {
                return [so]; // 同一时刻仅有一个BGM播放
            });
        }, 0);
    }

    const playEffect = ({ type, soundId }) => {
        // type: 主音，副音（阅读器）
        // soundId: 声音ID
        const ukey = uniqueKey.current++;
        const source = SOUNDS_CONFIG.find(e => lo.isEqual(e.id, soundId)).source;
        const volumeSettings = volumeState.current[type];
        const so = <Sound key={ukey} id={ukey} type={type} seek={0} soundId={soundId} isBGM={false} audioOnly={true} repeat={false} volume={volumeSettings.effect} source={source} onEnd={effectOnEnd} />;

        setEffectViews((list) => {
            const validList = list.filter(e => (effectPendingRemoveQueue.current.indexOf(e.props.id) == -1));
            if (validList.length <= 0) effectPendingRemoveQueue.current.length = 0;
            return [...validList, so];
        });
    }

    const fadeOutBGMAndPlayNext = () => {
        DeviceEventEmitter.emit('__@Sound.fadeOutBGM');
    }

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener(EventKeys.SOUND_BGM_PLAY, ({ type, soundId, seek }) => {
            bgmPendingQueue.current.push({ key: uniqueKey.current++, type, soundId, seek});
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
        const listener = DeviceEventEmitter.addListener(EventKeys.SOUND_EFFECT_PLAY, playEffect);
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

    return (
    <View>
        {bgmViews}
        {effectViews}
    </View>
    );
}

export default connect((state) => ({ ...state.SoundModel }))(SoundProvider);