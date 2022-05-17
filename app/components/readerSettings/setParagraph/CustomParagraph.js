import { View, Text, StyleSheet, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import React, { useEffect } from 'react';
import Slider from '@react-native-community/slider';

import {
    connect,
    action,
    EventKeys,
    ThemeContext,
} from "../../../constants";
import Modal from 'react-native-modal';

const Row = (props) => {
    return (
        <View style={{
            width: "100%",
            paddingLeft: 12,
            paddingRight: 12,
            height: 20,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
        }}>
            <Text style={{
                width: 100,
                fontSize: 14,
                justifyContent: 'center',
            }}>
                {props.title}
            </Text>

            <TouchableOpacity
                disabled={(props.defaultValue === props.min)}
                onPress={() => {
                    props.onChange((props.defaultValue - 1), props.type)
                }}
            >
                <Text style={{
                    width: 35,
                    fontSize: 22,
                    lineHeight: 22,
                    textAlign: 'center',
                }}>
                    -
                </Text>
            </TouchableOpacity>

            <View style={{
                flex: 1,
                height: "100%",
                justifyContent: 'center',
            }}>
                <Slider
                    value={props.defaultValue}
                    step={1}
                    maximumValue={props.max}
                    minimumValue={props.min}
                    minimumTrackTintColor="#088f7b"
                    maximumTrackTintColor="#3a3937"
                    onValueChange={(value) => { props.onChange(value, props.type) }}
                />
            </View>

            <TouchableOpacity
                disabled={(props.defaultValue === props.max)}
                onPress={() => {
                    props.onChange((props.defaultValue + 1), props.type)
                }}
            >
                <Text style={{
                    width: 35,
                    fontSize: 22,
                    lineHeight: 22,
                    textAlign: 'center',
                }}>
                    +
                </Text>
            </TouchableOpacity>

        </View>
    )
}


const CustomParagraph = (props) => {
    const { readerStyle } = props
    const [visible, setVisible] = React.useState(false);
    const theme = React.useContext(ThemeContext);

    useEffect(() => {
        setVisible(true)
        return () => {
            modalHide()
        };
    }, []);

    const handleChange = (value, type) => {
        props.dispatch(action('ArticleModel/changeTypesetting')({ type, value }));
    }

    const modalHide = () => {
        props.onClose()
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
            hideModalContentWhileAnimating={true}
            onModalHide={modalHide}
            onBackButtonPress={() => {
                setVisible(false);
            }}
            onBackdropPress={() => {
                setVisible(false);
            }}
            style={{ padding: 0, margin: 0, flex: 1, zIndex: 2, }}
        >
            <View style={[{ backgroundColor: readerStyle.popUpBgColor }, theme.readerSettingContainer]}>
                <Row
                    min={-3}
                    max={20}
                    defaultValue={readerStyle.paragraphSpacing}
                    title={`段间距(${readerStyle.paragraphSpacing})`}
                    onChange={handleChange}
                    type={"paragraphSpacing"}
                />
                <Row
                    min={-3}
                    max={20}
                    defaultValue={readerStyle.lineHeight}
                    title={`行间距(${readerStyle.lineHeight})`}
                    onChange={handleChange}
                    type={"lineHeight"}
                />
                <Row
                    min={0}
                    max={100}
                    defaultValue={readerStyle.leftPadding}
                    title={`左边空白(${readerStyle.leftPadding})`}
                    onChange={handleChange}
                    type={"leftPadding"}
                />
                <Row
                    min={0}
                    max={100}
                    defaultValue={readerStyle.rightPadding}
                    title={`右边空白(${readerStyle.rightPadding})`}
                    onChange={handleChange}
                    type={"rightPadding"}
                />
            </View>
        </Modal>
    )
}

export default connect(state => ({ ...state.ArticleModel }))(CustomParagraph);