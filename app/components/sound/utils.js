
import { DeviceEventEmitter } from 'react-native';
import { EventKeys } from '../../constants';

export function playBGM(soundId, type = 'masterVolume', seek = 0) {
    DeviceEventEmitter.emit(EventKeys.SOUND_BGM_PLAY, { type, soundId, seek });
}

export function playEffect(soundId, type = 'masterVolume') {
    DeviceEventEmitter.emit(EventKeys.SOUND_EFFECT_PLAY, { type, soundId });
}
