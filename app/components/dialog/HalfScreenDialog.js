import React from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    TouchableWithoutFeedback,
    ImageBackground,
    Image,
    Button,
    Dimensions,
    StyleSheet,
    SafeAreaView,
    SectionList,
    StatusBar,
} from 'react-native';
import { getWindowSize } from '../../constants';

const size = getWindowSize();

const HalfScreenDialog = (props) => {
    return (
        <View
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                // opacity: 0.5,
                // backgroundColor: '#fff'
            }}>
            <View
                style={{
                    width: 380,
                    height: 600,
                    backgroundColor: '#fff',
                }}>
                {/* head */}
                <View
                    style={{
                        position: 'relative',
                        overflow: 'hidden',
                        paddingLeft: 12,
                        paddingRight: 12,
                        backgroundColor: '#5f7157',
                        height: 50,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignContent: 'center',
                        alignItems: 'center',
                    }}>
                    {/* 标题 */}
                    <View
                        style={{
                            borderRadius: 5,
                            backgroundColor: '#e5d8ab',
                            justifyContent: 'center',
                            alignContent: 'center',
                            alignItems: 'center',
                            width: 150,
                        }}>
                        <Text
                            style={{
                                fontSize: 24,
                                color: '#6b4e28',
                            }}>
                            神秘阵盘
                        </Text>
                    </View>
                    {/* 关闭按钮 */}
                    <TouchableHighlight
                        onPress={props.onHide}
                        style={{
                            position: 'absolute',
                            right: 12,
                            top: -18,
                            overflow: 'hidden',
                        }}>
                        <View>
                            <Text
                                style={{
                                    fontSize: 60,
                                }}>
                                ×
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>

                {/* 显示区域 */}

                <TouchableWithoutFeedback onPress={()=>{
                    console.log("显示区域");
                }}>
                    <View
                        style={{
                            flex: 1,
                            paddingLeft: 12,
                            paddingRight: 12,
                            backgroundColor: '#ede0b6',
                        }}>
                        <View
                            style={{
                                height: 350,
                                marginTop: 12,
                                backgroundColor: '#ddd1ab',
                            }}>
                            <Text>sss</Text>
                        </View>

                        {/* 按钮区域 */}
                        <View style={{
                            marginTop: 20,
                        }}>
                            <Button title='转动左侧玉瓶' onPress={() => { console.log("点击"); }} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>

            </View>
        </View>
    );
};

export default HalfScreenDialog;
