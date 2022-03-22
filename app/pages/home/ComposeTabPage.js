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
    TouchableHighlight,
} from '../../constants/native-ui';

import {
    TabButton,
    NormalButton,
} from '../../constants/custom-ui';

class ComposeTabPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectId: -1, // 当前选择的道具ID
        };
    }

    componentDidMount() {
        this.props.dispatch(action('ComposeModel/filter')({ type: '' }));
    }

    _alertCopper(value) {
        this.props.dispatch(action('UserModel/alertCopper')({ value: value }));
    }

    _composeSelected(item) {
        this.setState({
            selectId: item.id,
        });
    }

    _typeFilter(type) {
        this.props.dispatch(action('ComposeModel/filter')({ type: type }));
    }

    _renderItem = (data) => {
        return (
        <TouchableHighlight onPress={() => this._composeSelected(data.item)} underlayColor='#a9a9a9' activeOpacity={0.7}>
            <View style={[styles.composeItem, (this.state.selectId == data.item.id ? styles.composeSelected : {})]}>
                <View style={{ flex: 1, flexDirection: 'row' }} >
                    <Text style={[{ marginLeft: 20, fontSize: 22 }, data.item.valid ? styles.valid : styles.notValid ]}>{data.item.name}</Text>
                </View>
                <View style={{ width: 100 }}>
                    <NormalButton title="选择配方" {...this.props} onPress={() => {  }} />
                </View>
            </View>
        </TouchableHighlight>
        );
    }

    render() {
        const selectedProp = this.props.listData.find(e => e.id == this.state.selectId);
        return (
            <View style={this.props.currentStyles.viewContainer}>
                <View style={styles.composeContainer}>
                    <View style={{ height: 40, justifyContent: 'center', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <View>
                            <Text>全部配方</Text>
                        </View>
                    </View>
                    <View style={{ height: 38, justifyContent: 'center', flexDirection: 'row', justifyContent: 'space-around', marginBottom: 5, alignItems: 'center' }}>
                        <TabButton title='全部' onPress={() => { this._typeFilter('全部') }} />
                        <TabButton title='药品' onPress={() => { this._typeFilter('药品') }} />
                        <TabButton title='材料' onPress={() => { this._typeFilter('材料') }} />
                        <TabButton title='工艺品' onPress={() => { this._typeFilter('工艺品')}} />
                        <TabButton title='武器' onPress={() => { this._typeFilter('武器') }} />
                        <TabButton title='防具' onPress={() => { this._typeFilter('防具') }} />
                    </View>
                    <View style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
                        <FlatList
                            data={this.props.listData}
                            renderItem={this._renderItem}
                            keyExtractor={item => item.id}
                        />
                    </View>
                    <View style={{ height: 100, flexDirection: 'column'}}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', backgroundColor: '#eee', margin: 10 }}>
                            <Text>{selectedProp != undefined ? (selectedProp.name + ':') : ''}</Text>
                            <Text>{(selectedProp != undefined && selectedProp.desc != undefined) ? selectedProp.desc : ''}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    composeContainer: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 10,
        alignSelf: 'stretch',
    },
    composeItem: {
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
    composeSelected: {
        backgroundColor: '#d6d6d6',
        opacity: 1,
    },
    notValid: {
        color: '#929292'
    },
    valid: {
        color: '#00f900'
    },
});

export default connect((state) => ({ ...state.AppModel, ...state.ComposeModel, user: { ...state.UserModel } }))(ComposeTabPage);