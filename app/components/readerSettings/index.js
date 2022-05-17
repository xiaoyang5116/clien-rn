import { View, Text, StyleSheet, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import React, { useEffect } from 'react';

import {
    connect,
    action,
    EventKeys,
    ThemeContext,
} from "../../constants";
import Modal from 'react-native-modal';
import RootView from '../RootView';

import ChangeFont from './ChangeFont';
import CustomColor from './customColor'
import SetParagraph from './setParagraph';

import CustomParagraph from './setParagraph/CustomParagraph';



const ReaderSettings = (props) => {
    const { readerStyle } = props
    const [visible, setVisible] = React.useState(false);
    const theme = React.useContext(ThemeContext);
    const [secondaryMenuType, setSecondaryMenuType] = React.useState(null);

    useEffect(() => {
        setVisible(true);
        return () => {
            setVisible(false)
        };
    }, []);

    const modalHide = () => {
        props.onClose()
        if (secondaryMenuType === "CustomParagraph") {
            const key = RootView.add(<CustomParagraph onClose={() => { RootView.remove(key) }} />)
        }
    }
    const openSecondaryMenu = (type) => {
        setVisible(false)
        setSecondaryMenuType(type)
    }

    return (
        <Modal
            isVisible={visible}
            animationIn="slideInUp"
            animationInTiming={300}
            animationOut="slideOutDown"
            animationOutTiming={300}
            backdropOpacity={0}
            backgroundTransitionOutTiming={0}
            onModalHide={modalHide}
            hideModalContentWhileAnimating={true}
            onBackButtonPress={() => {
                setVisible(false);
            }}
            onBackdropPress={() => {
                setVisible(false);
            }}
            style={{ padding: 0, margin: 0, flex: 1, zIndex: 1 }}
        >
            <View style={[{ backgroundColor: readerStyle.popUpBgColor }, theme.readerSettingContainer]}>
                <ChangeFont setVisible={setVisible} />
                <SetParagraph openSecondaryMenu={openSecondaryMenu} />
                <CustomColor setVisible={setVisible} />
            </View>
        </Modal>
    );
};

export default connect(state => ({ ...state.ArticleModel }))(ReaderSettings);


