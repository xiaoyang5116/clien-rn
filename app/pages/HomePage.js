
import React from 'react';

import {
  createAction,
  connect,
  Component
} from "../constants";

import {
  Button,
  Text,
  View,
} from 'react-native';

import { List } from '@ant-design/react-native';

class HomePage extends Component {
  
  onLogin = () => {
    this.props.dispatch(createAction('AppModel/login')())
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent:'flex-end' }}>
          <List header='基础用法'>
            <List.Item>1</List.Item>
            <List.Item>2</List.Item>
            <List.Item>3</List.Item>
          </List>
        </View>
        <View style={{ flex: 1 }}>
          <Text>你好:{this.props.name}</Text>
          <Text>哈哈,如此优秀的我3~{this.props.age}</Text>
          <Button title="点我" onPress={this.onLogin}/>
        </View>
      </View>
    );
  }
}

export default connect(({ AppModel }) => ({ ...AppModel }))(HomePage);