import React from 'react'
import { connect } from "../constants";
import { View, Text, ImageBackground, Image, Button } from 'react-native';

import Tooltip from '../components/tooltip';

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
    imgUrl: require('../assets/lace2.png'),
}

function FictionPage(props) {
    const currentStyles = props.currentStyles;
    return (
        <View style={[currentStyles.prologueContainer]}>
            {/* <ImageBackground source={data.imgUrl} style={{
                flex: 1,
                // backgroundColor:"pink"
                // height: ",
                // height:100,
                // width:366,
                // backgroundColor:"pink",
            }}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 20,
                    color: data.color,
                }}>
                    <Text style={{
                        fontSize: data.titleFontSize,
                    }}>{data.title}</Text>
                    <Text style={{
                        fontSize: data.titleFontSize,
                    }}>{data.content}</Text>
                </View>
            </ImageBackground> */}
            <View style={[currentStyles.prologueWrap, {
                color: data.color,
                backgroundColor: data.backgroundColor,
            }]}>
                <Text style={{
                    fontSize: data.titleFontSize,
                }}>{data.title}</Text>
                <Text style={{
                    fontSize: data.titleFontSize,
                }}>{data.content}</Text>
            </View>
            <Tooltip type={"BottomToTop"} content={"BottomToTop"} style={currentStyles} />
            <Tooltip type={"LeftToRight"} content={"LeftToRight"} style={currentStyles} />
            <Button title='游戏结束' onPress={() => {
                props.navigation.navigate('GameOver')
            }} />
        </View >
    )
}

export default connect((state) => ({ ...state.AppModel }))(FictionPage)