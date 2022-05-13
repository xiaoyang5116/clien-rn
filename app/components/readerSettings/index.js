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
import CustomColor from './customColor'


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
                <CustomColor />
                {/* <CustomColor /> */}
            </View>
        </Modal>
    );
};

export default connect(state => ({ ...state.ArticleModel }))(ReaderSettings);


