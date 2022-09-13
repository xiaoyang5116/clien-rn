import React from 'react';

import {
    action,
    connect,
    Component,
    StyleSheet,
    ThemeContext,
    DeviceEventEmitter,
} from "../../../constants";

import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity,
    SafeAreaView,
    TouchableWithoutFeedback,
} from '../../../constants/native-ui';

import {
    TabButton,
    TextButton,
} from '../../../constants/custom-ui';

import { Panel } from '../../../components/panel';

import FastImage from 'react-native-fast-image';
import ImageCapInset from 'react-native-image-capinsets-next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { px2pd } from '../../../constants/resolution';

class ComposeMainTabPage extends Component {

    static contextType = ThemeContext;

    constructor(props) {
        super(props);

        this.state = {
            selectId: -1, // 当前选择的道具ID
        };
    }

    componentDidMount() {
        this.props.dispatch(action('ComposeModel/filter')({ type: '' }));
    }

    _itemSelected(item) {
        this.setState({
            selectId: item.id,
        });
    }

    _composeSelected(item) {
        this.props.dispatch(action('ComposeModel/composeSelected')({ composeId: item.id }))
        .then(r => {
            // this.props.navigation.navigate('Home', { 
            //     screen: 'Compose',
            //     params: {
            //         screen: 'ComposeDetail',
            //     }
            // });
            this.props.navigation.navigate('ComposeDetail');
        });
    }

    _typeFilter(type) {
        this.props.dispatch(action('ComposeModel/filter')({ type: type }));
    }

    _renderItem = (data) => {
        return (
        <TouchableOpacity onPress={() => this._itemSelected(data.item)} activeOpacity={1}>
            <View style={styles.composeItem}>
                <View style={[styles.composeBorder, (data.item.id == 1) ? styles.composeTopBorder : {}]}>
                    <View style={{ flex: 1, flexDirection: 'row' }} >
                        <Text style={[{ marginLeft: 20, fontSize: 22 }, data.item.valid ? styles.valid : styles.notValid ]}>{data.item.name}</Text>
                    </View>
                </View>
                {(this.state.selectId == data.item.id) ? <FastImage style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.6 }} source={this.context.propSelectedImage} /> : <></>}
                <View style={{ position: 'absolute', right: 10, width: 85 }}>
                    <TextButton title="选择配方" {...this.props} fontSize={14} onPress={() => { this._composeSelected(data.item); }} />
                </View>
            </View>
        </TouchableOpacity>
        );
    }

    render() {
        const selectedProp = this.props.listData.find(e => e.id == this.state.selectId);
        return (
          <Panel patternId={3}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.composeContainer}>
                    <View style={{ height: 40, justifyContent: 'center', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <View>
                            <Text style={{ fontSize: 22, color: '#000' }}>全部配方</Text>
                        </View>
                        <View style={{ position: 'absolute', top: 5, left: 0 }}>
                            <TouchableWithoutFeedback onPress={() => {
                                DeviceEventEmitter.emit('__@ComposeMainTabPage.close');
                            }}>
                                <AntDesign name='left' size={30} color={'#000'} />
                            </TouchableWithoutFeedback>
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
                            style={{ paddingTop: 2 }}
                            data={this.props.listData}
                            renderItem={this._renderItem}
                            keyExtractor={item => item.id}
                        />
                    </View>
                    <View style={{ height: 100, marginBottom: 30, flexDirection: 'column'}}>
                        <ImageCapInset
                            style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.3 }}
                            source={require('../../../../assets/bg/area.png')}
                            capInsets={{ top: 30, right: 30, bottom: 30, left: 30 }}
                        />
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', backgroundColor: 'rgba(,0,0,0.85)', margin: 10 }}>
                            <Text>{selectedProp != undefined ? (selectedProp.name + ':') : ''}</Text>
                            <Text>{(selectedProp != undefined && selectedProp.desc != undefined) ? selectedProp.desc : ''}</Text>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
         </Panel>
        );
    }
}

const styles = StyleSheet.create({
    composeContainer: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,      
        alignSelf: 'stretch',
    },
    composeItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: px2pd(108),
    },
    composeBorder: {
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
    composeTopBorder: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
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

export default connect((state) => ({ ...state.AppModel, ...state.ComposeModel, user: { ...state.UserModel } }))(ComposeMainTabPage);