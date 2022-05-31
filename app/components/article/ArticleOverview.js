import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import ImageCapInset from 'react-native-image-capinsets-next';

import {
    connect,
    action,
    DeviceEventEmitter,
    EventKeys,
} from "../../constants";
import { TextButton } from '../../constants/custom-ui';

import RootView from '../../components/RootView';
import OptionsPage from '../../pages/OptionsPage';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ArticleOverview = (props) => {
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

    React.useEffect(() => {
        props.dispatch(action('ArticleModel/overViewOption')(overview.options))
            .then(r => {
                setOption(r[0]);
            })
    }, [])

    const layoutHandler = () => {
        props.dispatch(action('ArticleModel/layout')({
            key: itemKey,
            width: windowWidth,
            height: windowHeight,
        }));
    }
    const optionPressHandler = (data) => {
        props.dispatch(action('SceneModel/processActions')(data));
    }

    const DividingLine = () => {
        return (
            <Text
                numberOfLines={1}
                ellipsizeMode="clip"
                style={{ fontSize: 12, lineHeight: 12, marginTop: 4, marginBottom: 4 }}
            >
                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            </Text>
        )
    }

    return (
        <View
            style={{
                width: windowWidth,
                height: windowHeight,
                position: "relative",
                zIndex: 1,
            }}
            onLayout={layoutHandler}
        >
            {/* 外边框 */}
            <View style={{ position: "absolute", width: "100%", height: "100%", zIndex: 2, }}>
                <ImageCapInset
                    style={{ width: '100%', height: '100%', position: 'absolute' }}
                    source={require('../../../assets/button/40dpi.png')}
                    capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
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
                        marginTop: "40%",
                        width: "80%",
                        position: 'relative',
                    }}>
                        <ImageCapInset
                            style={{ width: '100%', height: '100%', position: 'absolute' }}
                            source={require('../../../assets/button/40dpi.png')}
                            capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
                        />
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

export default connect((state) => ({ ...state.AppModel, ...state.ArticleModel }))(ArticleOverview);

const styles = StyleSheet.create({
    bigTitle: {
        fontSize: 20,
        lineHeight: 24,
        fontWeight: "bold",
    },
    smallTitle: {
        fontSize: 16,
        lineHeight: 20,
    },
})
