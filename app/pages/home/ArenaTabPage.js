import React from 'react';

import {
    action,
    connect,
    Component,
    StyleSheet,
} from "../../constants";

import {
    RenderHTML
} from 'react-native-render-html';

import { Panel } from '../../components/panel';
import ProgressBar from '../../components/ProgressBar';
import { View, Text, FlatList } from '../../constants/native-ui';

class ArenaTabPage extends Component {

    constructor(props) {
        super(props);

        this.refList = React.createRef();
        this.listData = [];
        this.reportIndex = 0; // 战报播放INDEX
    }

    _renderPKMsg(data) {
        return (
            <View style={{ height: 20, justifyContent: 'center', margin: 5, paddingLeft: 5 }}>
                <RenderHTML contentWidth={100} source={{html: data.item.msg}} />
            </View>
            );
    }

    componentDidUpdate() {
        if (this.props.report.length > 0) {
            if (this.reportIndex < this.props.report.length) {
                setTimeout(() => {
                    this.setState({});
                }, 600);
            } else {
                this.listData.length = 0;
                this.reportIndex = 0;
                this.props.dispatch(action('ArenaModel/over')());
            }
        }
    }

    render() {
        let myLifePercent = 0;
        let enemyLifePercent = 0;

        if (this.props.report.length > 0 && this.reportIndex < this.props.report.length) {
            const item = this.props.report[this.reportIndex];
            this.listData.push({ id: this.listData.length + 1, msg: '<li style="color: #ffffff">{0}</li>'.format(item.msg) });

            if (this.props.myself.uid == item.attackerUid) {
                myLifePercent = (item.attackerLife / item.attackerOrgLife) * 100;
                enemyLifePercent = (item.defenderLife / item.defenderOrgLife) * 100;
            } else {
                myLifePercent = (item.defenderLife / item.defenderOrgLife) * 100;
                enemyLifePercent = (item.attackerLife / item.attackerOrgLife) * 100;
            }
            this.reportIndex += 1;
        }

        return (
            <Panel patternId={3}>
            <View style={this.props.currentStyles.viewContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 100, backgroundColor: '#403340' }}>
                    <View style={{ width: 90, height: 90, marginLeft: 5, marginRight: 5, flexDirection: 'row', borderRadius: 10, justifyContent: 'center', alignItems: 'center',  backgroundColor: '#ccc' }}>
                        <Text>{this.props.enemy.userName}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', height: '100%' }}>
                        <View style={{ height: 20, marginTop: 6, marginRight: 6, marginBottom: 3 }}>
                            <ProgressBar percent={enemyLifePercent} />
                        </View>
                        <View style={{ height: 20, marginTop: 3, marginRight: 6, marginBottom: 6 }}>
                            <ProgressBar percent={this.props.enemy.power / 1000 * 100} sections={[{x: 0, y: 100, color: '#12b7b5'}]} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Text style={{ color: '#fff' }}>攻击: {this.props.enemy.power}</Text>
                            <Text style={{ color: '#fff' }}>速度: {this.props.enemy.speed}</Text>
                            <Text style={{ color: '#fff' }}>暴击: {this.props.enemy.crit}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Text style={{ color: '#fff' }}>敏捷: {this.props.enemy.agile}</Text>
                            <Text style={{ color: '#fff' }}>防御: {this.props.enemy.defense}</Text>
                            <Text style={{ color: '#fff' }}>闪避: {this.props.enemy.dodge}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#5a5a70' }}>
                    <FlatList
                        ref={this.refList}
                        data={this.listData}
                        renderItem={this._renderPKMsg}
                        keyExtractor={item => item.id}
                        getItemLayout={(_data, index) => (
                            {length: 20, offset: 20 * index, index}
                        )}
                        onContentSizeChange={() => {
                            if (this.listData.length > 0) {
                                this.refList.current.scrollToIndex({ index: this.listData.length - 1 });
                            }
                        }}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 10, height: 100, backgroundColor: '#403340' }}>
                    <View style={{ width: 90, height: 90, marginLeft: 5, marginRight: 5, flexDirection: 'row', borderRadius: 10, justifyContent: 'center', alignItems: 'center',  backgroundColor: '#ccc' }}>
                        <Text>{this.props.myself.userName}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', height: '100%' }}>
                        <View style={{ height: 20, marginTop: 6, marginRight: 6, marginBottom: 3 }}>
                            <ProgressBar percent={myLifePercent} />
                        </View>
                        <View style={{ height: 20, marginTop: 3, marginRight: 6, marginBottom: 6 }}>
                            <ProgressBar percent={this.props.myself.power / 1000 * 100} sections={[{x: 0, y: 100, color: '#12b7b5'}]} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Text style={{ color: '#fff' }}>攻击: {this.props.myself.power}</Text>
                            <Text style={{ color: '#fff' }}>速度: {this.props.myself.speed}</Text>
                            <Text style={{ color: '#fff' }}>暴击: {this.props.myself.crit}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Text style={{ color: '#fff' }}>敏捷: {this.props.myself.agile}</Text>
                            <Text style={{ color: '#fff' }}>防御: {this.props.myself.defense}</Text>
                            <Text style={{ color: '#fff' }}>闪避: {this.props.myself.dodge}</Text>
                        </View>
                    </View>
                </View>
            </View>
            </Panel>
        );
    }

}

const styles = StyleSheet.create({
    logo: {
        width: 80,
        height: 80
    },
    buttonContainer: {
        width: 100,
        marginTop: 25,
    }
});

export default connect((state) => ({ ...state.AppModel, ...state.ArenaModel, user: { ...state.UserModel } }))(ArenaTabPage);