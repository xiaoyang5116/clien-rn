import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    Dimensions,
} from 'react-native'
import React from 'react'
import { TextButton } from '../../constants/custom-ui';
import * as Themes from '../../themes';

// const data = [
//     { title: "白天模式", id: 0, img: require('../../../assets/lottery_bg.jpg'), checked: true },
//     { title: "夜晚模式", id: 1, img: require('../../../assets/lottery_bg2.jpg'), checked: false },
// ]

const windowWidth = Dimensions.get('window').width;

const Theme = (props) => {
    let data = Themes.default.themes.map(t => t.id === Themes.default.themeId ? { ...t, checked: true } : { ...t, checked: false })
    const preThemeId = Themes.default.themeId;
    const [themeData, setThemeData] = React.useState(data);


    const changeHandler = (item, index) => {
        if (themeData[index].checked) {
            return;
        }
        setThemeData(themeData.map(i => i.id === item.id ? { ...i, checked: true } : { ...i, checked: false }))
        props.updateTheme(item.id);
    }

    const renderTheme = ({ item, index }) => {
        return (
            <View style={{ marginLeft: (windowWidth - (120 * 3)) / 4, width: 120 }}>
                <TouchableWithoutFeedback onPress={() => { changeHandler(item, index) }} >
                    <View style={{ position: 'relative', overflow: 'hidden' }}>
                        <Image source={item.img} style={{ height: 170, width: 120, borderRadius: 3 }} />
                        <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 30, flexDirection: 'row', justifyContent: "center", alignItems: 'center', backgroundColor: "#e8ddcc", borderBottomLeftRadius: 3, borderBottomRightRadius: 3 }}>
                            <Text style={{ fontSize: 18 }}>
                                {item.title}
                            </Text>
                        </View>
                        {
                            item.checked && (
                                <View style={{ position: 'absolute', right: 0, top: 0 }}>
                                    <Image source={require('../../../assets/button_icon/1.png')} style={{ height: 50, width: 50, }} />
                                </View>
                            )
                        }
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: "#fff", position: 'relative' }}>
            <View style={{ height: 50, width: '100%', backgroundColor: "#e8ddcc", justifyContent: 'center', flexDirection: "row", alignItems: "center", marginTop: 20, marginBottom: 30 }}>
                <Text style={{ fontSize: 24 }}>选择界面风格</Text>
            </View>
            <View>
                <FlatList
                    data={themeData}
                    renderItem={renderTheme}
                    keyExtractor={(item, index) => item + index}
                    ListFooterComponent={() => <View style={{ height: 200 }} />}
                    getItemLayout={(_data, index) => (
                        { length: 158, offset: 158 * index, index }
                    )}
                    numColumns={3}
                    columnWrapperStyle={{
                        justifyContent: 'flex-start',
                        marginTop: 18,
                        alignItems: 'center',

                    }}
                />
            </View>
            <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 70, backgroundColor: "#e8ddcc", flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <View>
                    <TextButton title="退出" onPress={props.onClose} />
                </View>
                <View>
                    <TextButton title="确认" onPress={props.onClose} />
                </View>
            </View>
        </View>
    )
}

export default Theme;