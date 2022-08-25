import React from 'react';

import {
    action,
    connect,
    Component,
    StyleSheet,
    ThemeContext,
    ScrollView,
} from "../../constants";

import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity,
} from '../../constants/native-ui';

import {
    TabButton,
} from '../../constants/custom-ui';

import { confirm } from '../../components/dialog';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';
import RootView from '../../components/RootView';
import PropTips from '../../components/tips/PropTips';

class PropsTabPage extends Component {

    static contextType = ThemeContext;

    constructor(props) {
        super(props);

        this.state = {
            selectId: -1, // 当前选择的道具ID
        };
    }

    componentDidMount() {
        this.props.dispatch(action('PropsModel/filter')({ type: '' }));
    }

    _alterCopper(value) {
        this.props.dispatch(action('UserModel/alterCopper')({ value: value }));
    }

    _propSelected(item) {
        this.setState({
            selectId: item.id,
        });
        setTimeout(() => {
            const key = RootView.add(<PropTips propId={item.id} onClose={() => {
                RootView.remove(key);
            }} />);
        }, 0);
    }

    _typeFilter(type) {
        this.props.dispatch(action('PropsModel/filter')({ type: type }));
    }

    _useProps() {
        confirm('确认使用？', 
        () => {
            this.props.dispatch(action('PropsModel/use')({ propId: this.state.selectId, num: 1 }));
        });
    }

    _discardProps() {
        confirm('确认丢弃？',
        () => {
            this.props.dispatch(action('PropsModel/discard')({ propId: this.state.selectId }));
        });
    }

    _renderItem = (data) => {
        let color = {};
        if (data.item.quality != undefined) {
            if (data.item.quality == '1') {
                color = styles.quality1;
            } else if (data.item.quality == '2') {
                color = styles.quality2;
            } else if (data.item.quality == '3') {
                color = styles.quality3;
            }
        }
        return (
        <TouchableOpacity onPress={() => this._propSelected(data.item)} activeOpacity={1}>
            <View style={[styles.propsItem, (data.item.id == 1) ? styles.propsTopBorder : {}]}>
                {(this.state.selectId == data.item.id) ? <FastImage style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.6 }} source={this.context.propSelectedImage} /> : <></>}
                <View style={styles.propsBorder}>
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <Text style={[{ marginLeft: 20, fontSize: 22 }, color]}>{data.item.name}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ marginRight: 20, fontSize: 22, color: '#424242', textAlign: 'right' }}>x{data.item.num}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={this.props.currentStyles.viewContainer}>
                <View style={styles.propsContainer}>
                    <View style={{ height: 40, justifyContent: 'center', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <View>
                            <Text>金币：0</Text>
                        </View>
                        <View>
                            <Text>银币：0</Text>
                        </View>
                        <View>
                            <Text>铜币：{this.props.user.copper}</Text>
                        </View>
                    </View>
                    <View style={{ height: 38 }}>
                        <ScrollView horizontal={true} 
                            pagingEnabled={false} 
                            showsHorizontalScrollIndicator={false} 
                            contentContainerStyle={{ justifyContent: 'center', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                            <TabButton title='全部' style={{ marginLeft: 8, marginRight: 15 }} onPress={() => { this._typeFilter('全部') }} />
                            <TabButton title='材料' style={{ marginRight: 15 }} onPress={() => { this._typeFilter('材料') }} />
                            <TabButton title='装备' style={{ marginRight: 15 }} onPress={() => { this._typeFilter('装备') }} />
                            <TabButton title='丹药' style={{ marginRight: 15 }} onPress={() => { this._typeFilter('丹药')}} />
                            <TabButton title='碎片' style={{ marginRight: 15 }} onPress={() => { this._typeFilter('碎片') }} />
                            <TabButton title='特殊' style={{ marginRight: 10 }} onPress={() => { this._typeFilter('特殊') }} />
                        </ScrollView>
                    </View>
                    <View style={{ height: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ marginLeft: 20, fontSize: 14, color: '#929292' }}>名称</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ marginRight: 20, textAlign: 'right', fontSize: 14, color: '#929292' }}>数量</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, paddingLeft: 10, paddingRight: 10, marginBottom: 40, }}>
                        <FlatList
                            style={{ paddingTop: 2 }}
                            data={this.props.listData}
                            renderItem={this._renderItem}
                            keyExtractor={item => item.recordId}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    propsContainer: {
        flex: 1,
        margin: 10,
        alignSelf: 'stretch',
    },
    propsItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: px2pd(108),
    },
    propsBorder: {
        flex: 1, 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginLeft: 1,
        marginRight: 1,
    },
    propsTopBorder: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    propSelected: {
        backgroundColor: '#d6d6d6',
        opacity: 1,
    },
    quality1: {
        color: '#929292'
    },
    quality2: {
        color: '#0433ff'
    },
    quality3: {
        color: '#00f900'
    },
});

export default connect((state) => ({ ...state.AppModel, ...state.PropsModel, user: { ...state.UserModel } }))(PropsTabPage);