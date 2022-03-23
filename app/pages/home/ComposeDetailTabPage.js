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

import lo from 'lodash';
import Toast from '../../components/toast';

class ComposeDetailTabPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectNum: '',
        };
    }
    _numSelected(num) {
        this.setState({
            selectNum: num,
        });
    }

    _compose() {
        if (lo.isEmpty(this.state.selectNum)) {
            Toast.show("请选择制作数量！");
            return;
        }
        
        this.props.dispatch(action('ComposeModel/compose')({ 
            selectNum: this.state.selectNum,
            composeId: this.props.selectComposeId,
        }));
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
              <Text>{data.item.reqNum}</Text>
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
            <TouchableHighlight key={key} onPress={() => { this._numSelected(e) }} underlayColor='#a9a9a9' activeOpacity={0.7}
                style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 30, backgroundColor: '#fff', borderWidth: 1, borderColor: '#999', margin: 5 }, (this.state.selectNum == e) ? styles.numSelected : {}]}>
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
                        <View style={{ flex: 1, height: 35, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderColor: '#999' }}><Text>{this.props.selectComposeDetail.targets[0].productNum}</Text></View>
                        <View style={{ flex: 1, height: 35, justifyContent: 'center', alignItems: 'center' }}><Text>{this.props.selectComposeDetail.targets[0].currNum}</Text></View>
                    </View>
                    <View style={{ height: 60, justifyContent: 'flex-start', flexDirection: 'column',  padding: 10, marginBottom: 5, borderWidth: 1, borderColor: '#999' }}>
                        <Text style={{ lineHeight: 20 }}>目标道具说明：</Text>
                        <Text style={{ color: '#999' }}>    {this.props.selectComposeDetail.targets[0].name} - {this.props.selectComposeDetail.targets[0].desc}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <SectionList
                            sections={this.props.selectComposeDetail.requirements}
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
                        <NormalButton title="确认制作" {...this.props} onPress={() => { this._compose() }} />
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
    numSelected: {
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