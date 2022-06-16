
import { DeviceEventEmitter } from 'react-native';
import { EventKeys } from '../../constants';
import lo from 'lodash';

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

// 自动选择BGM还是音效
export function playSound(config) {
    const { soundId } = config;
    
    if (lo.isEmpty(soundId)) {
        stopBGM();
    }

    const bgm = lo.isBoolean(config.bgm) ? config.bgm : lo.startsWith(soundId, 'BGM');
    bgm ? playBGM(config) : playEffect(config);
}

// 停止BGM
export function stopBGM() {
    DeviceEventEmitter.emit(EventKeys.SOUND_BGM_PLAY, { soundId: '' });
}