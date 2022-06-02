
import { DeviceEventEmitter } from 'react-native';
import { EventKeys } from '../../constants';

export function playBGM(soundId) {
    DeviceEventEmitter.emit(EventKeys.SOUND_BGM_PLAY, { soundId });
}
