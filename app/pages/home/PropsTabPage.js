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
    FlatList, 
    Button,
    TouchableHighlight,
} from '../../constants/native-ui';

class PropsTabPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectId: -1, // 当前选择的道具ID
        };
    }

    _alertCopper(value) {
        this.props.dispatch(action('UserModel/alertCopper')({ value: value }));
    }

    _propSelected(item) {
        this.setState({
            selectId: item.id,
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
        <TouchableHighlight onPress={() => this._propSelected(data.item)} underlayColor='#a9a9a9' activeOpacity={0.7}>
            <View style={[styles.propsItem, (this.state.selectId == data.item.id ? styles.propSelected : {})]}>
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <Text style={[{ marginLeft: 20, fontSize: 22 }, color]}>{data.item.name}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ marginRight: 20, fontSize: 22, color: '#424242', textAlign: 'right' }}>x{data.item.num}</Text>
                </View>
            </View>
        </TouchableHighlight>
        );
    }

    render() {
        const selectedProp = this.props.listData.find(e => e.id == this.state.selectId);
        return (
            <View style={this.props.currentStyles.viewContainer}>
                <View style={styles.propsContainer}>
                    <View style={{ height: 80, justifyContent: 'center', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <View>
                            <Text>金币：{this.props.user.copper}</Text>
                        </View>
                        <View>
                            <Text>银币：{this.props.user.copper}</Text>
                        </View>
                        <View>
                            <Text>铜币：{this.props.user.copper}</Text>
                        </View>
                    </View>
                    <View style={{ height: 38, justifyContent: 'center', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <View style={{ borderStyle: 'solid', borderWidth: 1, borderColor: '#5e5e5e' }} >
                            <Button color='#5e5e5e' title='全部' />
                        </View>
                        <View style={{ borderStyle: 'solid', borderWidth: 1, borderColor: '#5e5e5e' }}>
                            <Button color='#5e5e5e' title='材料' />
                        </View>
                        <View style={{ borderStyle: 'solid', borderWidth: 1, borderColor: '#5e5e5e' }}>
                            <Button color='#5e5e5e' title='装备' />
                        </View>
                        <View style={{ borderStyle: 'solid', borderWidth: 1, borderColor: '#5e5e5e' }}>
                            <Button color='#5e5e5e' title='丹药' />
                        </View>
                        <View style={{ borderStyle: 'solid', borderWidth: 1, borderColor: '#5e5e5e' }}>
                            <Button color='#5e5e5e' title='特殊' />
                        </View>
                    </View>
                    <View style={{ height: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ marginLeft: 20, fontSize: 14, color: '#929292' }}>名称</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ marginRight: 20, textAlign: 'right', fontSize: 14, color: '#929292' }}>数量</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
                        <FlatList
                            data={this.props.listData}
                            renderItem={this._renderItem}
                            keyExtractor={item => item.id}
                        />
                    </View>
                    <View style={{ height: 100, flexDirection: 'column'}}>
                        <View style={{ height: 35, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>{selectedProp != undefined ? selectedProp.name : ''}</Text>
                            <Text>{(selectedProp != undefined && selectedProp.desc != undefined) ? selectedProp.desc : ''}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                            <View>
                                <Button title='使用' />
                            </View>
                            <View>
                                <Button title='丢弃' />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    propsContainer: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 10,
        alignSelf: 'stretch',
    },
    propsItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderTopWidth: 1,
        borderTopColor: '#fff',
        backgroundColor: '#ebebeb',
        height: 40,
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