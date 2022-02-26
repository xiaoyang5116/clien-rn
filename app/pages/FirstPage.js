
import React from 'react';

import {
  RenderHTML
} from 'react-native-render-html';

import {
  action,
  connect,
  Component,
  StyleSheet,
  getWindowSize,
  ScrollView
} from "../constants";

import AsideModal from '../components/AsideModal';
import * as RootNavigation from '../utils/RootNavigation'
import { Button, Text, View } from '../constants/native-ui';

const size = getWindowSize();

const HTML_TPL = `
<div style="font-size: 24px; padding: 6px;">
{CONTENT}
</div>
`;

const TXT = `
<pre>
  追求富贵与名声，自己也成为亡命冒险者之一。在公会登录姓名准备出征。凭着手中一把剑闯天下，最后邂逅的是遭到怪物袭击的美少女。

  响彻云霄的惨叫、<span style="color:red">怪物的慑人咆哮</span>、
  略显羞红的双颊.，倒映着自己身影、水润动人的双眸；萌芽的淡淡恋情。
  <span style="color:#669900">有时与酒馆的可爱店员谈论那天的冒险，培养两人之间的感情。</span>

  <b>有时保护精灵族少女免受野蛮的同业者骚扰。</b>
  有时被女生看见自己与其他女孩相亲相爱，引来一阵醋劲。

  结论。
</pre>
`;

let html = HTML_TPL.replace("{CONTENT}", TXT);

class FirstPage extends Component {

  _onClick = (e) => {
    this.props.dispatch(action('AppModel/firstStep')({ step: 1}));
  }

  render() {
    return (
      <View style={styles.viewContainer}>
        <View style={styles.topBarContainer}>
        </View>
        <ScrollView style={styles.bodyContainer}>
          <RenderHTML contentWidth={size.width} source={{html: html}} />
        </ScrollView>
        <View style={styles.bottomContainer}>
          <View style={styles.button}>
            <Button title='上一页' color="#bcfefe" onPress={()=>RootNavigation.navigate('Home')} disabled={true} />
          </View>
          <View style={styles.button}>
            <Button title='下一页' color="#bcfefe" onPress={this._onClick} />
          </View>
          <AsideModal />
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: "flex-start", 
    backgroundColor: "#CCE8CF"
  },
  topBarContainer: {
    height: 20,
    backgroundColor: "#999"
  },
  bodyContainer: {
    flex: 1
  },
  bottomContainer: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'baseline',
    alignSelf: 'stretch',
  },
  button: {
    width:100, 
    backgroundColor:'#003964'
  }
});

export default connect(({ AppModel }) => ({ ...AppModel }))(FirstPage);