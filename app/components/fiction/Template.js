import React, { PureComponent } from 'react'
import {
    View,
    Text,
    ImageBackground,
    Image,
    Button,
    useWindowDimensions,
    StyleSheet,
    SafeAreaView,
    SectionList,
    StatusBar
} from 'react-native';

import ChapterTemplate from './components/ChapterTemplate';
import TextTemplate from './components/TextTemplate';
import OptionTemplate from './components/OptionTemplate';
import PopUp from './components/PopUp';
import ToastTemplate from './components/ToastTemplate'


export default class Template extends PureComponent {
    render() {
        switch (this.props.template) {
            case "ChapterTemplate":
                return <ChapterTemplate {...this.props} />
            case "TextTemplate":
                return <TextTemplate {...this.props} />
            case "OptionTemplate":
                return <OptionTemplate  {...this.props} />
            case "popUp":
                return <PopUp  {...this.props} />
            case "toast":
                return <ToastTemplate  {...this.props} />
        }
    }
}
