import React, { Component } from 'react'
import {
    View,
    Text,
    ImageBackground,
    Image,
    Button,
    getWindowSize,
    Dimensions,
    StyleSheet,
    SafeAreaView,
    SectionList,
    StatusBar
} from 'react-native';
import Dialog from '../../dialog'


export default class PopUp extends Component {
    timer = null
    componentWillUnmount() {
        clearTimeout(this.timer)
    }
    render() {
        // if (this.props.currentShow) {
        //     this.timer = setTimeout(() => {
        //         Dialog.halfScreenDialog()
        //     }, 100);
        //     return null
        // }
        return null
    }
}
