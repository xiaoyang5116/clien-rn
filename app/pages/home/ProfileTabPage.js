import React from 'react';

import {
  connect,
  Component,
  StyleSheet,
} from "../../constants";

import { View, Text, Image } from '../../constants/native-ui';

class ProfileTabPage extends Component {

    render() {
        return (
            <View style={styles.viewContainer}>
                <Text>个人信息页面</Text>
                <Image style={styles.logo} source={{ uri: 'https://imgo.928vbi.com/img2020/6/11/15/2020061162540848.jpg' }} />
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
    }
});

export default connect(({ AppModel }) => ({ ...AppModel }))(ProfileTabPage);