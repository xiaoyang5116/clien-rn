import React from 'react';
import Modal from 'react-native-modal';

import {
    action,
    connect,
    StyleSheet,
    PureComponent,
  } from "../constants";

import { Button, Text, View } from '../constants/native-ui';

// 旁白对话框
class AsideModal extends PureComponent {

    _onNext = () => {    
        this.props.dispatch(action('AsideModel/next')());
    }

    render() {
        return (
            <Modal style={{ flex: 1 }} isVisible={this.props.visible} animationIn="pulse" animationOut="fadeOut" animationOutTiming={600} backdropColor="#fff" backdropOpacity={1}>
                <View style={[styles.center]}>
                    <View style={[this.props.style == 1 ? styles.parent1 : styles.parent2, styles.center]}>
                        <View style={{ flex: 4 }}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>{this.props.title}</Text>
                            </View>
                            <View style={styles.contentContainer}>
                                <Text style={styles.content}>{this.props.content}</Text>
                            </View>
                        </View>
                        <View style={styles.bottomContainer}>
                            <View style={styles.bottomBanner}>
                                <Button title='>>>' color="#bcfefe" onPress={this._onNext} />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
};

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    parent1: {
        width:300,
        height:300,
        backgroundColor: '#CCC',
        borderRadius: 10
    },
    parent2: {
        width:300,
        height:300,
        borderRadius: 10
    },
    titleContainer: {
        flex: 1, 
        marginTop: 3, 
        width: 280, 
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    contentContainer: {
        flex: 3, 
        padding: 10, 
        justifyContent: "space-around"
    },
    bottomContainer: {
        flex: 2, 
        justifyContent: 'center'
    },
    bottomBanner: {
        backgroundColor: "#003964", 
        width: 280, 
        marginBottom: 3
    },
    title: {
        fontSize: 24,
        color: '#000',
        textAlign: 'center',
    },
    content: {
        fontSize: 24,
        color: 'black',
        textAlign: 'center'
    },
});

export default connect(({ AsideModel }) => ({ ...AsideModel }))(AsideModal);