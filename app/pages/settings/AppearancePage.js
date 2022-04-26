import {
    View,
    Text,
    FlatList,
    TouchableWithoutFeedback,
    SafeAreaView,
    Image,
    ImageBackground,
    Dimensions,
} from 'react-native';
import React, { useEffect } from 'react';
import { TextButton, TitleHeader } from '../../constants/custom-ui';
import * as Themes from '../../themes';
import {
    action,
    connect,
    ThemeContext,
} from "../../constants";


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
    const themeId = themeData.find(t => t.checked === true).id;

    const changeHandler = (item, index) => {
        if (themeData[index].checked) {
            return;
        }
        props.dispatch(action('AppModel/changeTheme')({ themeId })).then(() => {
            setThemeData(
                themeData.map(i => i.id === item.id ? { ...i, checked: true } : { ...i, checked: false }),
            )
        })


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
        <View style={{ flex: 1 }}>
            <View style={[theme.pageContainer,]}>
                <View
                    style={[{ height: 130, width: "100%", position: 'relative', }, theme.rowCenter]}>
                    <Image
                        style={[{ position: 'absolute', width: "100%", height: "100%", zIndex: 1 }, theme.rowCenter]}
                        source={require('../../../assets/frame/titleFrame3.png')}
                    />
                    <View style={[{ height: 50, width: "100%" }, theme.headerBgColor, theme.rowCenter]}>
                        <Text style={[{ fontSize: 24 }, theme.headerTextColor,]}>选择界面风格</Text>
                    </View>
                </View>

                <View>
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
                <View style={[theme.footerContainer, theme.rowCenter]}>
                    <Image
                        style={[{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: 1 }]}
                        source={require('../../../assets/frame/frame6.png')}
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
        </View>
    );
};

export default connect((state) => ({ ...state.AppModel }))(AppearancePage);
