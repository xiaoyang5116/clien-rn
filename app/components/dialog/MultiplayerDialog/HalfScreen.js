import React, { useState, useEffect, useRef, createRef } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    Image,
    ImageBackground,
} from 'react-native'

import {
    action,
    connect,
    AppDispath,
    ThemeContext,
    changeAvatar
} from "../../../constants";

import TextAnimation from '../../textAnimation'
import { TextButton } from '../../../constants/custom-ui';
import { px2pd } from '../../../constants/resolution';
import AntDesign from 'react-native-vector-icons/AntDesign';


const HalfScreen = (props) => {

    const theme = React.useContext(ThemeContext);

    const {
        onDialogCancel,
        viewData,
        nextParagraph,
        refFlatList,
        historyDialogData,
        renderDialog,
        currentDialogData,
        renderBtn,
    } = props


    return (
        <View style={styles.fullscreenContainer}>
            <ImageBackground
                style={styles.halfContainer}
                source={theme.dialog_Multiplayer_Bg}
            >
                <ImageBackground
                    style={styles.dialogHeader}
                    source={theme.dialog_Multiplayer_header_Bg}
                >
                    <View style={{ position: 'absolute', left: 12, zIndex: 2 }}>
                        <TouchableOpacity onPress={onDialogCancel} style={{ flexDirection: 'row', alignItems: "center", }}>
                            <AntDesign name={'left'} size={20} />
                            <Text style={[styles.titleFontSize, styles.back]}>返回</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.titleFontSize, styles.title]}>{viewData.title}</Text>
                </ImageBackground>
                <TouchableWithoutFeedback onPress={nextParagraph}>
                    <View style={{
                        flex: 1,
                        paddingLeft: 12,
                        paddingRight: 12,
                    }}>
                        {/* content */}
                        <View style={{ width: "100%", height: '70%' }} >
                            <FlatList
                                ref={refFlatList}
                                data={historyDialogData}
                                renderItem={renderDialog}
                                keyExtractor={(item, index) => item + index}
                                ListFooterComponent={() => <View style={{ height: 24 }} />}
                                onContentSizeChange={() => {
                                    if (historyDialogData.length > 0) {
                                        refFlatList.current.scrollToEnd({ animated: true })
                                    }
                                }}
                            />
                        </View>

                        {/* 按钮区域 */}
                        <View style={{ marginTop: 12 }}>
                            <FlatList
                                data={currentDialogData.btn}
                                renderItem={renderBtn}
                                keyExtractor={(item, index) => item + index}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ImageBackground>
        </View>
    )
}

export default HalfScreen

const styles = StyleSheet.create({
    fullscreenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    halfContainer: {
        width: 360,
        height: 600,
    },
    dialogHeader: {
        height: px2pd(158),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // borderBottomColor: '#6a655e',
        // borderBottomWidth: 1,
        // marginLeft: 12,
        // marginRight: 12,
    },
    back: {
        textAlign: 'left',
        flex: 1,
    },
    title: {
        textAlign: 'center',
        flex: 2,
    },
    multifunction: {
        textAlign: 'right',
        flex: 1,
    },
    paddingLeft: {
        paddingLeft: 12,
    },
    paddingRight: {
        paddingRight: 12,
    },
    tipLeftTriangle: {
        position: "absolute",
        left: -7,
        top: 8,
        height: 0,
        width: 0,
        borderTopColor: 'transparent',
        borderTopWidth: 8,
        borderBottomColor: 'transparent',
        borderBottomWidth: 8,
        borderRightColor: '#fff',
        borderRightWidth: 8,
    },
    tipRightTriangle: {
        position: "absolute",
        right: -7,
        top: 8,
        height: 0,
        width: 0,
        borderTopColor: 'transparent',
        borderTopWidth: 8,
        borderBottomColor: 'transparent',
        borderBottomWidth: 8,
        borderLeftColor: '#fff',
        borderLeftWidth: 8,
    },
    titleFontSize: {
        fontSize: 20,
        color: '#000'
    }
})