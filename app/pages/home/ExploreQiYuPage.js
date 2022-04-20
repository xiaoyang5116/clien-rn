import React from 'react';

import {
    action,
    connect,
    Component,
    StyleSheet,
} from "../../constants";

import { 
    View, 
    Text, 
    Image,
    FlatList, 
    SafeAreaView, 
    TouchableWithoutFeedback,
} from '../../constants/native-ui';

import { TextButton } from '../../constants/custom-ui';

// 探索奇遇页面
class ExploreQiYuPage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
        <TouchableWithoutFeedback onPress={() => { this.props.onClose() }}>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.85)' }}>
                <View>
                    <Text style={{ marginBottom: 20, color: '#ccc', fontSize: 36 }}>奇遇</Text>
                </View>
                <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#a6c2cb' }}>
                </View>
                <View>
                    <Text style={{ color: '#fff', lineHeight: 35, }}>点击任意区域领取奖励</Text>
                    <TextButton title={'领取奖励'} {...this.props} onPress={() => {
                    }} />
                </View>
            </View>
        </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
});

export default connect((state) => ({ ...state.ExploreModel, ...state.AppModel }))(ExploreQiYuPage);