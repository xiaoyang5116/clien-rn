import React, { Component, PureComponent } from 'react';

import type {Node} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  SectionList,
  View,
  Dimensions,
  Alert,
} from 'react-native';

import Modal from 'react-native-modal';

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    parent: {
        width:300,
        height:300,
        backgroundColor: '#FFFFFF',
        borderRadius: 10
    },
    title: {
        fontSize: 25,
        color: '#000',
        textAlign: 'center',
    },
    content: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center'
    },
});

const { width, height, scale, fontScale } = Dimensions.get('window');

export default class DialogModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            content: props.content,
            func: null,
            args: null,
            visible: false
        };
    }

    show(title, content, func, args) {
        let newState = {
            title: title,
            content: content,
            func: func,
            args: args,
            visible: true
        };
        newState.visible = true;
        this.setState(newState);
    }

    hide() {
        let newState = {
            title: '',
            content: '',
            func: null,
            args: null,
            visible: false
        };
        this.setState(newState);
    }

    _onClickButton = (status) => {
        if (this.state.func != null) {
            this.state.func(status, this.state.args);
        }
        this.hide();
    }

    render() {
        return (
            <Modal isVisible={this.state.visible} animationIn="fadeIn" animationOut="fadeOut" backdropColor="#666" backdropOpacity={0.5}>
                <View style={[styles.center]}>
                    <View style={[styles.parent, styles.center]}>
                        <View style={{ flex: 4 }}>
                            <View style={{ flex: 1, marginTop: 3, width: 280, borderBottomWidth: 1, borderBottomColor: "#000", justifyContent: "center" }}>
                                <Text style={styles.title}>{this.state.title}</Text>
                            </View>
                            <View style={{ flex: 3, padding: 10, justifyContent: "space-around" }}>
                                <Text style={styles.content}>{this.state.content}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 2, justifyContent: 'center' }}>
                            <View style={{backgroundColor: "#003964", width: 280, marginBottom: 3}}>
                                <Button title='确认' color="#bcfefe" onPress={()=> this._onClickButton('OK')} />
                            </View>
                            <View style={{backgroundColor: "#003964", width: 280, marginTop: 3}}>
                                <Button title='取消' color="#bcfefe" onPress={()=> this._onClickButton('CANCEL')} />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
};
