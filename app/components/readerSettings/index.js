import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';

import Modal from 'react-native-modal';


const RowLayout = (props) => {
    return (
        <View style={styles.row}>
            <View style={styles.itemLeft}>{props.left}</View>
            <View style={styles.itemRight}>{props.right}</View>
        </View>
    )
}

const SetFontSize = (props) => {
    return (
        <View style={styles.row}>
            <View style={styles.leftBox}>
                <TouchableOpacity>
                    <View style={[styles.border1, styles.leftItem, theme.BorderColor]}>
                        <Text style={[styles.fontSizeText,]}>A-</Text>
                    </View>
                </TouchableOpacity>
                <View style={[ styles.leftItem]}>
                    <Text style={[styles.fontSizeText,]}>A-</Text>
                </View>
                <TouchableOpacity>
                    <View style={[styles.border1, styles.leftItem, theme.BorderColor]}>
                        <Text style={[styles.fontSizeText,]}>A+</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={[styles.border1, styles.leftItem, theme.BorderColor]}>
                        <Text style={[styles.fontSizeText,]}>A-</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={[styles.rightBox]}>
                <TouchableOpacity>
                    <View style={[styles.border1, styles.rightItem, theme.BorderColor]}>
                        <Text style={[styles.fontSizeText,]}>自定义字体</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const ReaderSettings = () => {
    const [visible, setVisible] = React.useState(false);
    useEffect(() => {
        setVisible(true);
        return () => {
            setVisible(false);
        };
    }, []);
    return (
        <Modal
            isVisible={visible}
            animationIn="slideInUp"
            animationInTiming={300}
            animationOut="slideOutDown"
            animationOutTiming={300}
            backdropOpacity={0}
            onBackButtonPress={() => {
                setVisible(false);
            }}
            onBackdropPress={() => {
                setVisible(false);
            }}
            style={{ padding: 0, margin: 0, flex: 1, zIndex: 1 }}
        >
            <View style={[styles.container, theme.bgColor]}>
                <SetFontSize />
                <SetFontSize />
                <SetFontSize />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 200,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    border1: {
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8,
    },
    fontSizeText: {
        fontSize: 14,
    },
    row: {
        width: '100%',
        height: 50,
        paddingLeft: 12,
        paddingRight: 12,
        marginTop: 12,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: "red"
    },
    leftBox: {
        width: '70%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: "space-around",
        alignItems: 'center',
    },
    leftItem: {
        // backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightBox: {
        width: '30%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
    },
    rightItem: {
        justifyContent: "center",
        alignItems: 'center',
    },



});

const theme = StyleSheet.create({
    bgColor: {
        backgroundColor: '#faf3e8',
    },
    BorderColor: {
        borderColor: "#eee7dd",
    },


});

export default ReaderSettings;
