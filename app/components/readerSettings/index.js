import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';

import {
    connect,
    action,
    EventKeys,
    ThemeContext,
} from "../../constants";
import Modal from 'react-native-modal';
import ChangeFont from './ChangeFont';


const ReaderSettings = (props) => {
    const { readerStyle } = props
    const [visible, setVisible] = React.useState(false);
    const theme = React.useContext(ThemeContext);

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
            <View style={[{ backgroundColor:readerStyle.popUpBgColor}, theme.readerSettingContainer]}>
                <ChangeFont />
                {/* <SetFontSize />
                <SetFontSize /> */}
            </View>
        </Modal>
    );
};

export default connect(state => ({ ...state.ArticleModel }))(ReaderSettings);


// const styles = StyleSheet.create({
//     container: {
//         position: 'absolute',
//         left: 0,
//         right: 0,
//         bottom: 0,
//         height: 200,
//         justifyContent: 'flex-start',
//         alignItems: 'center',
//     },
//     border1: {
//         borderWidth: 1,
//         borderRadius: 8,
//         paddingLeft: 16,
//         paddingRight: 16,
//         paddingTop: 8,
//         paddingBottom: 8,
//     },
//     fontSizeText: {
//         fontSize: 14,
//     },
//     row: {
//         width: '100%',
//         height: 50,
//         paddingLeft: 12,
//         paddingRight: 12,
//         marginTop: 12,
//         flexDirection: 'row',
//         flexWrap: 'nowrap',
//         justifyContent: 'center',
//         alignItems: 'center',
//         // backgroundColor: "red"
//     },
//     leftBox: {
//         width: '70%',
//         height: '100%',
//         flexDirection: 'row',
//         justifyContent: "space-around",
//         alignItems: 'center',
//     },
//     leftItem: {
//         // backgroundColor: "#fff",
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     rightBox: {
//         width: '30%',
//         height: '100%',
//         flexDirection: 'row',
//         justifyContent: "center",
//         alignItems: 'center',
//     },
//     rightItem: {
//         justifyContent: "center",
//         alignItems: 'center',
//     },



// });

// const theme = StyleSheet.create({
//     bgColor: {
//         backgroundColor: '#faf3e8',
//     },
//     BorderColor: {
//         borderColor: "#eee7dd",
//     },


// });

