import React from 'react';
import { DeviceEventEmitter } from 'react-native';
import { EventKeys } from '../constants';

export default class StoryUtils {
    static refreshCurrentChat() {
        DeviceEventEmitter.emit(EventKeys.FORCE_UPDATE_STORY_CHAT);
    }
}