
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

 class HomePage extends Component {
  
  onLogin = () => {
    this.props.dispatch(createAction('AppModel/login')())
  }

  render() {
    return (
      <View>
        <Text>你好:{this.props.name}</Text>
        <Text>哈哈,如此优秀的我3~{this.props.age}</Text>
        <Button title="点我" onPress={this.onLogin}/>
      </View>
    );
  }
}

export default connect(({ AppModel }) => ({ ...AppModel }))(HomePage);