
import React from 'react';

import {
  action,
  connect,
  Component,
} from "../constants";

import { 
  View, 
  Text, 
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from '../constants/native-ui';

import { TextButton } from '../constants/custom-ui';
import * as DateTime from '../utils/DateTimeUtils';
import { confirm } from '../components/dialog';
import SpriteSheet from '../components/SpriteSheet';
import { range } from 'lodash';

class ArchivePage extends Component {

  constructor(props) {
    super(props);
    this.times = 0;
    this.timer = null;
    this.mummy = null;
  }

  _renderItem = (data) => {
    const item = data.item;
    const bgColor = (this.props.currentArchiveIndex == item.id) ? '#ffa997' : '#ddd';
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => this._onDoubleClick(item)}>
          <View style={{ width: '100%', height: 50, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
                          marginTop: 5, marginBottom: 5, borderColor: '#999', borderWidth: 1, backgroundColor: bgColor }}>
              <Text style={{ width: 60, textAlign: 'center' }}>ID：{item.id}</Text>
              <Text style={{ flex: 1, paddingLeft: 5, color: '#669900' }}>{item.desc.sceneName}</Text>
              <Text style={{ width: 160, textAlign: 'center' }}>{DateTime.format(item.dt, 'yyyy-MM-dd hh:mm:ss')}</Text>
          </View>
      </TouchableOpacity>
    )
  }

  _onClearArchive() {
    confirm('确认清档？', 
    () => {
      this.props.dispatch(action('AppModel/clearArchive')());
    });
  }

  _onArchive() {
    confirm('确认存档？', 
    () => {
      this.props.dispatch(action('AppModel/archive')({ title: '手动存档' }));
    });
  }

  _onDoubleClick = (item) => {
    clearTimeout(this.timer);
    if (++this.times >= 2) { // 双击触发
        this.times = 0;
        this.props.dispatch(action('AppModel/selectArchive')({ archiveId: item.id }));
    }
    this.timer = setTimeout(() => {
        this.times = 0;
    }, 500);
  }

  componentDidMount() {
    const play = type => {
      this.mummy.play({
        type,
        fps: Number(30),
        loop: true,
        resetAfterFinish: false,
        onFinish: () => console.log('hi')
      });
    };
    play('walk');
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ margin: 10, padding: 5, width: '90%', height: '70%', backgroundColor: '#eee' }}>
            <View style={{ alignSelf: 'stretch', flexDirection: 'row', backgroundColor: '#999' }}>
              <Text style={{ lineHeight: 26, fontWeight: 'bold', margin: 10 }}>存档列表:（双击选择）</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <FlatList
                    data={this.props.archiveList}
                    renderItem={this._renderItem}
                    keyExtractor={item => item.id}
                />
            </View>
            <View style={{ position: 'absolute', top: -100, left: 80, transform: [{ scale: 1.4 }] }}>
              <SpriteSheet
                ref={ref => (this.mummy = ref)}
                source={require('../../assets/animations/effect.png')}
                columns={10}
                rows={6}
                // height={200} // set either, none, but not both
                // width={200}
                imageStyle={{ marginTop: -1 }}
                animations={{
                  walk: range(60),
                }}
              />
            </View>
            <View style={{ paddingTop: 10, paddingBottom: 10, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', 
                borderColor: '#999', borderWidth: 1, backgroundColor: '#ede7db' }}>
                <TextButton {...this.props} title="返回" onPress={() => { this.props.onClose() }} />
                <TextButton {...this.props} title="存档" onPress={() => { this._onArchive() }} />
                <TextButton {...this.props} title="清档" onPress={() => { this._onClearArchive() }} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

}

export default connect((state) => ({ ...state.AppModel }))(ArchivePage);