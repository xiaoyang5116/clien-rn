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
// import ImageCapInset from 'react-native-image-capinsets';
import ImageCapInset from 'react-native-image-capinsets-next';

// 探索线索页面
class ExploreXianSuoPage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
        <TouchableWithoutFeedback onPress={() => { this.props.onClose() }}>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.85)' }}>
                <View>
                    <Text style={{ marginBottom: 20, color: '#ccc', fontSize: 36 }}>线索</Text>
                </View>
                {/* <View style={{ width: '90%', height: 500 }}>
                    <ImageCapInset
                        style={{ width: '100%', height: '100%', position: 'absolute' }}
                        source={require('../../../assets/tab_icon.png')}
                        capInsets={{ top: 100, right: 100, bottom: 100, left: 100 }}
                    />
                    <View style={{ position: 'absolute', left: 155, bottom: 30, width: 70  }}>
                        <Text style={{ fontFamily: 'SourceHanSerifCN-Bold', fontSize: 38, color: '#ff1e0c' }}>恭喜发财</Text>
                    </View>
                </View> */}
                <View style={{ width: '90%', height: 500, backgroundColor: '#a6c2cb' }}>
                    <ImageCapInset
                        style={{ width: '100%', height: '100%', position: 'absolute' }}
                        source={require('../../../assets/9patch.png')}
                        capInsets={{ top: 80, right: 80, bottom: 80, left: 80 }}
                    />
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

export default connect((state) => ({ ...state.ExploreModel, ...state.AppModel }))(ExploreXianSuoPage);