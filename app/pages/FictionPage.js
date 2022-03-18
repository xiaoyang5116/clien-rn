import React, { Component } from 'react'
import { connect } from "../constants";
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
import Fiction from '../components/fiction'


// 小说背景颜色
// * 河白色 #FFFFFF rgb(255, 255, 255)  
// * 杏仁黄 #FAF9DE rgb(250, 249, 222)
// * 秋叶褐 #FFF2E2 rgb(255, 242, 226)
// * 胭脂红 #FDE6E0 rgb(253, 230, 224)
// * 青草绿 #E3EDCD rgb(227, 237, 205)
// * 海天蓝 #DCE2F1 rgb(220, 226, 241)
// * 葛巾紫 #E9EBFE rgb(233, 235, 254)
// * 极光灰 #EAEAEF rgb(234, 234, 239)

const data = {
    title: "序章",
    content: "穿越做乞丐",
    backgroundColor: "#E3EDCD",
    titleFontSize: 24,
    contentFontSize: 20,
    color: "black",
    // imgUrl: require('../../assets/lace2.png'),
}


function FictionPage(props) {
    const currentStyles = props.currentStyles;
    const window = useWindowDimensions();
    return (
        <View style={[styles.container, { width: window.width }]}>
            <Fiction currentStyles={currentStyles} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    }
});

export default connect((state) => ({ ...state.AppModel }))(FictionPage)