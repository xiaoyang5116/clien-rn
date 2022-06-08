
import { DeviceEventEmitter } from 'react-native';
import { EventKeys } from '../../constants';

// 参数: soundId, type, seek
export function playBGM(config) {
    const payload = { ...config };
    if (config.type == undefined) payload.type = 'masterVolume';
    if (config.seek == undefined) payload.seek = 0;
    DeviceEventEmitter.emit(EventKeys.SOUND_BGM_PLAY, payload);
}

// 参数: soundId, type
export function playEffect(config) {
    const payload = { ...config };
    if (config.type == undefined) payload.type = 'masterVolume';
    DeviceEventEmitter.emit(EventKeys.SOUND_EFFECT_PLAY, payload);
}
