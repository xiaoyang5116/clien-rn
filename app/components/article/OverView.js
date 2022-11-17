import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import ImageCapInset from 'react-native-image-capinsets-next';

import {
    connect,
    action,
    statusBarHeight,
    DataContext
} from "../../constants";
import { TextButton } from '../../constants/custom-ui';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';
import * as RootNavigation from '../../utils/RootNavigation';

const Width = Dimensions.get('window').width;
const Height = (Dimensions.get('window').height) - statusBarHeight;


// 封面View
const OverView = (props) => {
    // {
    // "itemKey": 6, 
    // "overview": {
    //     "author": "XXX", 
    //     "options": {"chatId": "WZXX_[START]", "sceneId": "WZXX_[START]"}, 
    //     "imageUri": "", 
    //     "introduction": "依然相信，文字的力量", 
    //     "novelTitle": "元宇修真", 
    //     "type": "仙侠"
    // }}
    const { itemKey, overview } = props
    const [option, setOption] = React.useState(overview.options)

    const dataContext = React.useContext(DataContext);

    React.useEffect(() => {
        props.dispatch(action('ArticleModel/overViewOption')(overview.options))
            .then(r => {
                setOption(r[0]);
            })
    }, [])

    const layoutHandler = () => {
        props.dispatch(action('ArticleModel/layout')({
            key: itemKey,
            width: Width,
            height: Height,
        }));
    }
    const optionPressHandler = (data) => {
        dataContext.isCover = false
        props.dispatch(action('SceneModel/processActions')(data));
    }

    const DividingLine = () => {
        return (
            <Text
                numberOfLines={1}
                ellipsizeMode="clip"
                style={{ fontSize: 12, lineHeight: 12, marginTop: 4, marginBottom: 4, color: "#000" }}
            >
                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            </Text>
        )
    }

    return (
        <View
            style={{
                width: Width,
                height: Height,
                position: "relative",
                zIndex: 1,
            }}
            onLayout={layoutHandler}
        >
            {/* 外边框 */}
            <View style={{ position: "absolute", width: "100%", height: "100%", zIndex: 2, }}>
                <FastImage
                    style={{ width: '100%', height: '100%', position: 'absolute' }}
                    source={require('../../../assets/bg/overView_bg.png')}
                />
            </View>

            {/* 内容 */}
            <View style={{
                flex: 1,
                zIndex: 3,
                justifyContent: "center",
                alignItems: 'center'
            }}>
                <View style={{ height: "70%", width: "100%", justifyContent: "flex-start", alignItems: 'center' }}>
                    <View style={{
                        marginTop: "20%",
                        width: px2pd(720),
                        position: 'relative',
                        alignItems: 'center'
                    }}>
                        <FastImage style={{ width: px2pd(720), height: px2pd(382) }} source={require('../../../assets/bg/overView_coverImage.png')} />
                        <View style={{ padding: 20, }}>
                            <Text style={[styles.bigTitle, { textAlign: 'center' }]}>{overview.novelTitle}</Text>
                            <View style={{ width: "100%", marginTop: 12, marginBottom: 12, }}>
                                <DividingLine />
                                <Text style={styles.smallTitle}>{overview.introduction}</Text>
                                <Text style={[styles.smallTitle, { textAlign: 'right' }]}>—— {overview.author}</Text>
                                <DividingLine />
                            </View>
                            <Text style={styles.smallTitle}>类型：{overview.type}</Text>
                        </View>
                    </View>
                    <View style={{ position: "absolute", bottom: 0, paddingLeft: 20, paddingRight: 20, width: "80%", }}>
                        <TextButton title="开始阅读" onPress={() => { optionPressHandler(option); }} />
                    </View>
                </View>

                {/* footer */}
                <View style={{ height: "30%", width: "100%", }}></View>
            </View>
        </View>
    )
}

export default connect((state) => ({ ...state.AppModel, ...state.ArticleModel }))(OverView);

const styles = StyleSheet.create({
    bigTitle: {
        fontSize: 20,
        lineHeight: 24,
        fontWeight: "bold",
        color: "#000"
    },
    smallTitle: {
        fontSize: 16,
        lineHeight: 20,
        color: "#000"
    },
})
