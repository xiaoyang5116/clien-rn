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
// import ChapterTemplate from '../ChapterTemplate'
import ChapterTemplate from './ChapterTemplate';
import TextTemplate from './TextTemplate';


export default class Template extends PureComponent {
    render() {
        switch (this.props.template) {
            case "ChapterTemplate":
                return (
                    <ChapterTemplate {...this.props} />
                )
            case "TextTemplate":
                return (
                    <TextTemplate {...this.props} />
                )
            default:
                return (
                    <ChapterTemplate {...this.props}  />
                )
        }
    }
}
