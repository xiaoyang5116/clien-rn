import React from 'react'

import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView
} from 'react-native'

import { Panel } from '../../components/panel'
import { Switch } from '@rneui/themed';
import { connect } from 'react-redux';
import { action } from '../../constants';
import lo from 'lodash';

const TitleText = (props) => {
    return (
        <View style={[styles.bgColor, { width: "55%", alignItems: 'center' }]}>
            <Text style={[styles.fontColor, styles.title]}>{props.children}</Text>
        </View>
    )
}

const DividingLine = () => {
    return (
        <View style={styles.dividingLine}></View>
    )
}

const DarkLightSettings = (props) => {

    const [appFollow, setAppFollow] = React.useState(lo.isBoolean(props.darkLightSettings.app) ? props.darkLightSettings.app : false);
    const [readerFollow, setReaderFollow] = React.useState(lo.isBoolean(props.darkLightSettings.reader) ? props.darkLightSettings.reader : false);

    const readerFollowOnValueChanged = (v) => {
        setReaderFollow(v);
        props.dispatch(action('AppModel/setDarkLightMode')({ reader: v }));
    }

    const appFollowOnValueChanged = (v) => {
        setAppFollow(v);
        props.dispatch(action('AppModel/setDarkLightMode')({ app: v }));
    }

    return (
        <Panel>
            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingLeft: 24, paddingRight: 24 }}>
                    <View style={styles.block}>
                        <TitleText>阅读器设置</TitleText>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.fontColor}>跟随系统</Text>
                            <Switch color={"#bae8ff"} value={readerFollow} onValueChange={readerFollowOnValueChanged} />
                        </View>
                    </View>
                    <DividingLine />
                    <View style={styles.block}>
                        <TitleText>应用设置</TitleText>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.fontColor}>跟随系统</Text>
                            <Switch color={"#bae8ff"} value={appFollow} onValueChange={appFollowOnValueChanged} />
                        </View>
                    </View>
                    <DividingLine />
                    <View style={{ marginTop: 24, width: "40%" }}>
                        <TouchableOpacity onPress={() => { props.navigation.goBack() }}>
                            <Text style={styles.btn} >退出</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Panel>
    );
}

export default connect((state) => ({ ...state.AppModel }))(DarkLightSettings);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        paddingTop: 4,
        paddingBottom: 4
    },
    fontColor: {
        color: "#273136",
    },
    bgColor: {
        backgroundColor: '#bae8ff',
    },
    dividingLine: {
        height: 1,
        width: "100%",
        backgroundColor: "#7a94b2",
        marginBottom: 16,
        marginTop: 16,
    },
    btn: {
        color: "#273136",
        backgroundColor: '#bae8ff',
        textAlign: 'center',
        paddingTop: 4,
        paddingBottom: 4
    },
    block: {
        marginTop: 40, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center'
    },
})