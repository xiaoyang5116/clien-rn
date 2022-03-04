import React from 'react';

import {
    action,
    connect,
    Component,
    StyleSheet,
} from "../../constants";

import { View, Text, Image, Button } from '../../constants/native-ui';

class ProfileTabPage extends Component {

    _onClearArchive = (e) => {
        this.props.dispatch(action('AppModel/clearArchive')());
    }

    render() {
        return (
            <View style={styles.viewContainer}>
                <Text>个人信息页面</Text>
                <Image style={styles.logo} source={{ uri: 'https://imgo.928vbi.com/img2020/6/11/15/2020061162540848.jpg' }} />
                <View style={styles.buttonContainer}>
                    <Button title='清档' onPress={this._onClearArchive} color="#bcfefe" />
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    logo: {
        width: 80,
        height: 80
    },
    buttonContainer: {
        width: 100,
        marginTop: 25,
        backgroundColor: '#003964'
    }
});

export default connect(({ AppModel }) => ({ ...AppModel }))(ProfileTabPage);