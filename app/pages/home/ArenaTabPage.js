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

import ProgressBar from '../../components/ProgressBar';
import { View, Text, FlatList } from '../../constants/native-ui';

class ArenaTabPage extends Component {

    constructor(props) {
        super(props);

        this.refList = React.createRef();

        this.myself = {
            uid: 1,
            userName: '光头强',
            life: 8000,// 生命
            speed: 100, // 速度
            power: 600, // 灵力
            agile: 300, // 敏捷
            defense: 100, // 防御
            crit: 10, // 暴击
            dodge: 15, // 闪避
            skillIds: [1, 2],
        };

        this.enemy = {
            uid: 100000,
            userName: '熊大',
            life: 8000,//生命
            speed: 80,  // 速度
            power: 450, // 灵力
            agile: 350, // 敏捷
            defense: 80, // 防御
            crit: 10, // 暴击
            dodge: 15, // 闪避
            skillIds: [1, 3],
        };

        this.data = [];

        // 战报
        this.state = {
            report: [],
            index: 0,
        };
    }

    _renderPKMsg(data) {
        return (
            <View style={{ height: 20, justifyContent: 'center', margin: 5, paddingLeft: 5 }}>
                <RenderHTML contentWidth={100} source={{html: data.item.msg}} />
            </View>
            );
    }

    componentDidMount() {
        this.props.dispatch(action('ChallengeModel/challenge')({ myself: this.myself, enemy: this.enemy }))
        .then(r => {
            this.setState({ report: r, index: 0 });
        });
    }

    componentDidUpdate() {
        if (this.state.report.length > 0 && this.state.index < this.state.report.length) {
            setTimeout(() => {
                this.setState({});
            }, 600);
        }
    }

    render() {
        let myLifePercent = 0;
        let enemyLifePercent = 0;

        if (this.state.report.length > 0 && this.state.index < this.state.report.length) {
            const item = this.state.report[this.state.index];
            this.data.push({ id: this.data.length + 1, msg: '<li style="color: #ffffff">{0}</li>'.format(item.msg) });

            if (this.myself.uid == item.attackerUid) {
                myLifePercent = (item.attackerLife / item.attackerOrgLife) * 100;
                enemyLifePercent = (item.defenderLife / item.defenderOrgLife) * 100;
            } else {
                myLifePercent = (item.defenderLife / item.defenderOrgLife) * 100;
                enemyLifePercent = (item.attackerLife / item.attackerOrgLife) * 100;
            }
            this.state.index += 1;
        }

        return (
            <View style={this.props.currentStyles.viewContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 100, backgroundColor: '#403340' }}>
                    <View style={{ width: 90, height: 90, marginLeft: 5, marginRight: 5, flexDirection: 'row', borderRadius: 10, justifyContent: 'center', alignItems: 'center',  backgroundColor: '#ccc' }}>
                        <Text>{this.enemy.userName}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', height: '100%' }}>
                        <View style={{ height: 20, marginTop: 6, marginRight: 6, marginBottom: 3 }}>
                            <ProgressBar percent={enemyLifePercent} />
                        </View>
                        <View style={{ height: 20, marginTop: 3, marginRight: 6, marginBottom: 6 }}>
                            <ProgressBar percent={this.enemy.power / 1000 * 100} sections={[{x: 0, y: 100, color: '#12b7b5'}]} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Text style={{ color: '#fff' }}>灵力: {this.enemy.power}</Text>
                            <Text style={{ color: '#fff' }}>速度: {this.enemy.speed}</Text>
                            <Text style={{ color: '#fff' }}>暴击: {this.enemy.crit}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Text style={{ color: '#fff' }}>敏捷: {this.enemy.agile}</Text>
                            <Text style={{ color: '#fff' }}>防御: {this.enemy.defense}</Text>
                            <Text style={{ color: '#fff' }}>闪避: {this.enemy.dodge}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#5a5a70' }}>
                    <FlatList
                        ref={this.refList}
                        data={this.data}
                        renderItem={this._renderPKMsg}
                        keyExtractor={item => item.id}
                        getItemLayout={(_data, index) => (
                            {length: 20, offset: 20 * index, index}
                        )}
                        onContentSizeChange={() => {
                            this.refList.current.scrollToIndex({ index: this.data.length - 1 });
                        }}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 100, backgroundColor: '#403340' }}>
                    <View style={{ width: 90, height: 90, marginLeft: 5, marginRight: 5, flexDirection: 'row', borderRadius: 10, justifyContent: 'center', alignItems: 'center',  backgroundColor: '#ccc' }}>
                        <Text>{this.myself.userName}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', height: '100%' }}>
                        <View style={{ height: 20, marginTop: 6, marginRight: 6, marginBottom: 3 }}>
                            <ProgressBar percent={myLifePercent} />
                        </View>
                        <View style={{ height: 20, marginTop: 3, marginRight: 6, marginBottom: 6 }}>
                            <ProgressBar percent={this.myself.power / 1000 * 100} sections={[{x: 0, y: 100, color: '#12b7b5'}]} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Text style={{ color: '#fff' }}>灵力: {this.myself.power}</Text>
                            <Text style={{ color: '#fff' }}>速度: {this.myself.speed}</Text>
                            <Text style={{ color: '#fff' }}>暴击: {this.myself.crit}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Text style={{ color: '#fff' }}>敏捷: {this.myself.agile}</Text>
                            <Text style={{ color: '#fff' }}>防御: {this.myself.defense}</Text>
                            <Text style={{ color: '#fff' }}>闪避: {this.myself.dodge}</Text>
                        </View>
                    </View>
                </View>
            </View>
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

export default connect((state) => ({ ...state.AppModel, user: { ...state.UserModel } }))(ArenaTabPage);