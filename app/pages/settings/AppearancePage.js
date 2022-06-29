import {
    View,
    Text,
    FlatList,
    TouchableWithoutFeedback,
    SafeAreaView,
    Image,
    Dimensions,
} from 'react-native';
import React, { useEffect } from 'react';

import FastImage from 'react-native-fast-image';
import ImageCapInset from 'react-native-image-capinsets-next';

import { px2pd } from '../../constants/resolution';
import { TextButton, TitleHeader, Header1 } from '../../constants/custom-ui';
import * as Themes from '../../themes';
import { connect, action } from "../../constants";
import { Panel } from '../../components/panel'


const AppearancePage = props => {
    const windowWidth = Dimensions.get('window').width;
    const data = Themes.default.themes.map(t =>
        t.id === Themes.default.themeId
            ? { ...t, checked: true }
            : { ...t, checked: false },
    );
    const [themeData, setThemeData] = React.useState(data);

    const theme = Themes.default.themes.find(
        t => t.id === Themes.default.themeId,
    ).style;

    const changeHandler = (item, index) => {
        if (themeData[index].checked) {
            return;
        }
        setThemeData(
            themeData.map(i => i.id === item.id ? { ...i, checked: true } : { ...i, checked: false }),
        );
        props.dispatch(action('AppModel/changeTheme')({ themeId: item.id }));
    };

    const renderTheme = ({ item, index }) => {
        return (
            <View style={{ marginLeft: (windowWidth - 120 * 3) / 4, width: 120 }}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        changeHandler(item, index);
                    }}>
                    <View style={{ position: 'relative', overflow: 'hidden' }}>
                        <Image
                            source={item.img}
                            style={{ height: 170, width: 120, borderRadius: 3 }}
                        />
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                height: 30,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#e8ddcc',
                                borderBottomLeftRadius: 3,
                                borderBottomRightRadius: 3,
                            }}>
                            <Text style={{ fontSize: 18 }}>{item.title}</Text>
                        </View>
                        {item.checked && (
                            <View style={{ position: 'absolute', right: 0, top: 0 }}>
                                <Image
                                    source={require('../../../assets/button_icon/1.png')}
                                    style={{ height: 50, width: 50 }}
                                />
                            </View>
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    };
    return (
        <FastImage style={{ flex: 1 }} source={theme.profileBg}>
            {/* <SafeAreaView style={{ flex: 1 }}> */}
            <View style={[theme.pageContainer,]}>
                <View style={{ position: 'relative', }}>
                    {/* <TitleHeader
                            style={[theme.rowCenter,]}
                            source={require('../../../assets/frame/titleFrame3.png')}
                            title={'选择界面风格'}
                        /> */}
                    <Header1 title={'选择界面风格'} />
                </View>

                <View style={{ flex: 1 }}>
                    <FlatList
                        data={themeData}
                        renderItem={renderTheme}
                        keyExtractor={(item, index) => item + index}
                        ListFooterComponent={() => <View style={{ height: 200 }} />}
                        getItemLayout={(_data, index) => ({
                            length: 158,
                            offset: 158 * index,
                            index,
                        })}
                        numColumns={3}
                        columnWrapperStyle={{
                            justifyContent: 'flex-start',
                            marginTop: 18,
                            alignItems: 'center',
                        }}
                    />
                </View>
                <View style={[theme.rowCenter, {
                    height: px2pd(168),
                    width: '100%',
                    marginBottom: 30
                }]}>
                    <Image
                        style={[{ width: "100%", height: "100%", position: "absolute", zIndex: 0 }]}
                        source={theme.dialogBg_2_footer_img}
                    />
                    <ImageCapInset
                        style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 1 }}
                        source={theme.dialogBorder_1_img}
                        capInsets={{ top: 10, right: 10, bottom: 10, left: 10 }}
                    />
                    <View style={[theme.rowSpaceAround, { flex: 1, zIndex: 2 }]}>
                        <View>
                            <TextButton title="退出" onPress={() => { props.navigation.goBack() }} style={{ width: 120 }} />
                        </View>
                        <View>
                            <TextButton title="确认" onPress={() => { props.navigation.goBack() }} style={{ width: 120 }} />
                        </View>
                    </View>
                </View>
            </View>
            {/* </SafeAreaView> */}
        </FastImage>
    );
};

export default connect((state) => ({ ...state.AppModel }))(AppearancePage);
