
import { DeviceEventEmitter } from 'react-native';
import { EventKeys } from '../../constants';

export function playBGM(soundId, type = 'masterVolume') {
    DeviceEventEmitter.emit(EventKeys.SOUND_BGM_PLAY, { type, soundId });
}

export function playEffect(soundId, type = 'masterVolume') {
    DeviceEventEmitter.emit(EventKeys.SOUND_EFFECT_PLAY, { type, soundId });
}
