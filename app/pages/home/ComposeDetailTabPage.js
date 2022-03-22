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
    SectionList, 
    TouchableHighlight,
} from '../../constants/native-ui';

import {
    NormalButton,
} from '../../constants/custom-ui';

const DATA = [
    {
        title: '所需材料|需求|现有',
        data: [
            { name: 'aaaa', requireNum: 100, currNum: 80 },
            { name: 'bbbb', requireNum: 200, currNum: 60 },
            { name: 'cccc', requireNum: 300, currNum: 50 },
            { name: 'cccc', requireNum: 300, currNum: 50 },
            { name: 'cccc', requireNum: 300, currNum: 50 },
            { name: 'cccc', requireNum: 300, currNum: 50 },
        ]
    },
    {
        title: '工具/环境|需求|现有',
        data: [
            { name: 'aaaa', requireNum: 100, currNum: 80 },
            { name: 'bbbb', requireNum: 200, currNum: 60 },
            { name: 'cccc', requireNum: 300, currNum: 50 },
            { name: 'cccc', requireNum: 300, currNum: 50 },
            { name: 'cccc', requireNum: 300, currNum: 50 },
        ]
    }
];

class ComposeDetailTabPage extends Component {

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

    _renderSectionHeader = ({ section: { title } }) => {
        const [ column1, column2, column3 ] = title.split('|');
        return (
          <View style={{ flexDirection: 'row', height: 30, justifyContent: 'space-around', alignItems: 'center', marginTop: 5, borderWidth: 1, borderColor: '#999', backgroundColor: '#eee' }}>
              <View style={{ flex: 2, height: 30, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderColor: '#999' }}>
                <Text>{column1}</Text>
              </View>
              <View style={{ flex: 1, height: 30, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderColor: '#999' }}>
                <Text>{column2}</Text>
              </View>
              <View style={{ flex: 1, height: 30, justifyContent: 'center', alignItems: 'center' }}>
                <Text>{column3}</Text>
              </View>
          </View>
        );
      }

    _renderItem = (data) => {
        return (
        <View style={{ flexDirection: 'row', height: 30, justifyContent: 'space-around', alignItems: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#999' }}>
            <View style={{ flex: 2, height: 30, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderColor: '#999' }}>
              <Text>{data.item.name}</Text>
            </View>
            <View style={{ flex: 1, height: 30, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderColor: '#999' }}>
              <Text>{data.item.requireNum}</Text>
            </View>
            <View style={{ flex: 1, height: 30, justifyContent: 'center', alignItems: 'center' }}>
              <Text>{data.item.currNum}</Text>
            </View>
        </View>
        );
    }

    render() {
        const selectedProp = this.props.listData.find(e => e.id == this.state.selectId);

        const numbersView = [];
        const numberTypes = ['1', '2', '5', '10', '50', '最大'];
        let key = 0;
        numberTypes.forEach(e => {
            numbersView.push(
            <TouchableHighlight key={key} onPress={() => {}} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 30, backgroundColor: '#fff', borderWidth: 1, borderColor: '#999', margin: 5 }} underlayColor='#a9a9a9' activeOpacity={0.7}>
                <View>
                    <Text>{e}</Text>
                </View>
            </TouchableHighlight>
            );
            key++;
        });

        return (
            <View style={this.props.currentStyles.viewContainer}>
                <View style={styles.composeContainer}>
                    <View style={{ height: 35, justifyContent: 'center', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <NormalButton title="返回" {...this.props} onPress={()=> {
                            this.props.navigation.navigate('Home', { 
                                screen: 'tab2',
                                params: {
                                    screen: 'ComposeMain',
                                }
                            }) 
                        }} />
                    </View>
                    <View style={{ height: 35, justifyContent: 'center', flexDirection: 'row', justifyContent: 'space-around', padding: 10, borderWidth: 1, 
                        borderColor: '#999', backgroundColor: '#eee', alignItems: 'center' }}>
                        <View style={{ flex: 3, height: 35, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderColor: '#999' }}><Text>制作目标</Text></View>
                        <View style={{ flex: 1, height: 35, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderColor: '#999' }}><Text>产出</Text></View>
                        <View style={{ flex: 1, height: 35, justifyContent: 'center', alignItems: 'center' }}><Text>现有</Text></View>
                    </View>
                    <View style={{ height: 35, justifyContent: 'center', flexDirection: 'row', justifyContent: 'space-around', padding: 10, marginBottom: 5, borderLeftWidth: 1, borderBottomWidth: 1, borderRightWidth: 1, 
                        borderColor: '#999', alignItems: 'center' }}>
                        <View style={{ flex: 3, height: 35, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderColor: '#999' }}><Text>{this.props.selectComposeDetail.name}</Text></View>
                        <View style={{ flex: 1, height: 35, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderColor: '#999' }}><Text>0</Text></View>
                        <View style={{ flex: 1, height: 35, justifyContent: 'center', alignItems: 'center' }}><Text>0</Text></View>
                    </View>
                    <View style={{ height: 60, justifyContent: 'flex-start', flexDirection: 'column',  padding: 10, marginBottom: 5, borderWidth: 1, borderColor: '#999' }}>
                        <Text style={{ lineHeight: 20 }}>目标道具说明：</Text>
                        <Text style={{ color: '#999' }}>    XXXXXxxxxxx</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <SectionList
                            sections={DATA}
                            keyExtractor={(item, index) => item + index}
                            renderItem={this._renderItem}
                            renderSectionHeader={this._renderSectionHeader}
                        />
                    </View>
                    <View style={{ height: 80, justifyContent: 'center', flexDirection: 'column', justifyContent: 'space-around', marginBottom: 5, borderWidth: 1, borderColor: '#999', backgroundColor: '#eee', alignItems: 'center' }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>制作数量</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', height: 30, padding: 5, alignItems: 'center' }}>
                            {numbersView}
                        </View>
                    </View>
                    <View style={{ height: 80, justifyContent: 'center', paddingLeft: 30, paddingRight: 30, marginTop: 5, marginBottom: 5 }}>
                        <NormalButton title="确认制作" {...this.props} />
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

export default connect((state) => ({ ...state.AppModel, ...state.ComposeModel, user: { ...state.UserModel } }))(ComposeDetailTabPage);