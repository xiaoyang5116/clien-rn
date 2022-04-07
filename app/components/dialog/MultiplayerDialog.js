import React, { useState, useEffect } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
} from 'react-native'
import {
    action,
    connect,
    getAvatar
} from "../../constants";


const MultiplayerDialog = (props) => {
    const { currentStyles, viewData, onDialogCancel } = props;
    const [currentSpeaker, setCurrentSpeaker] = useState(viewData.sections[0].dialog[0])
    const figureInfo = props.figureList
    // console.log("currentSpeaker", currentSpeaker);

    useEffect(() => {
        if (props.figureList.length === 0) {
            props.dispatch(action('FigureModel/getFigureList')());
        }
    }, [])
    function changeAvatar(avatar) {
        const avatarList = [
            { id: "1", img: require('../../../assets/avatar/1.jpg'), },
            { id: "2", img: require('../../../assets/avatar/2.jpg'), },
        ]
        return avatarList.find(a => a.id === avatar).img
    }

    const renderItem = ({ item }) => {
        // console.log("figureInfo", figureInfo);
        // console.log("item", item);
        if (figureInfo.length > 0) {
            const figure = figureInfo.find(f => f.id === currentSpeaker.id)
            console.log("getAvatar",getAvatar(figure.avatar));
            return (
                <View style={{ flexDirection: 'row-reverse', justifyContent: 'flex-start', flexWrap: 'nowrap', alignItems: 'center', marginTop: 12, }}>
                    <View>
                        <Image source={changeAvatar(figure.avatar)} style={{ height: 50, width: 50, borderRadius: 25 }} />
                    </View>
                    <View style={{ padding: 12, maxWidth: 280 }}>
                        <Text>{figure.name}:</Text>
                        <Text>{item}</Text>
                    </View>
                </View>
            )

        }

    }

    // console.log("figureList", props.figureList);
    return (
        <View style={styles.fullscreenContainer}>
            <View style={[styles.halfContainer, currentStyles.bgColor]}>
                {/* header */}
                <View style={styles.dialogHeader}>
                    <Text onPress={onDialogCancel} style={styles.titleFontSize}>返回</Text>
                    <Text style={styles.titleFontSize}>{viewData.title}</Text>
                    <Text style={styles.titleFontSize}>多功能</Text>
                </View>

                {/* content */}
                <View style={{ width: "100%" }}>
                    <FlatList
                        data={currentSpeaker.content}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => item + index}
                    />
                </View>

                {/* 按钮区域 */}
                {/* <View>
                    <Text>MultiplayerDialog</Text>
                </View> */}
            </View>

        </View>
    )
}
export default connect((state) => ({ ...state.FigureModel }))(MultiplayerDialog)

const styles = StyleSheet.create({
    fullscreenContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    fullContainer: {
        flex: 1,
        width: '100%',
    },
    halfContainer: {
        width: 360,
        height: 600,
        paddingLeft: 12,
        paddingRight: 12,
    },
    dialogHeader: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#6a655e',
        borderBottomWidth: 1,
    },
    titleFontSize: {
        fontSize: 20,
    }
});