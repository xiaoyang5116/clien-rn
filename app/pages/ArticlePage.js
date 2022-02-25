
import React from 'react';

import { 
  NavigationContainer 
} from '@react-navigation/native';

import {
  RenderHTML
} from 'react-native-render-html';

import {
  createAction,
  connect,
  Component,
  Dimensions
} from "../constants";

import { Button, Text, View } from '../constants/native-ui';
const { width, height, scale, fontScale } = Dimensions.get('window');
import * as RootNavigation from '../utils/RootNavigation';

const HTML_TPL = `
<div style="font-size: 24px; width: ${width}px; padding: 6px;">
{CONTENT}
</div>
`;

const TXT = `
  追求富贵与名声，自己也成为亡命冒险者之一。在公会登录姓名准备出征。凭着手中一把剑闯天下，最后邂逅的是遭到怪物袭击的美少女。

  响彻云霄的惨叫、怪物的慑人咆哮、于千钧一发之际飞身解危的锐利剑啸。怪物毙命，剩下坐在地面的可爱女生，与冷静伫立、帅气无比的自己。

  略显羞红的双颊.，倒映着自己身影、水润动人的双眸；萌芽的淡淡恋情。

  有时与酒馆的可爱店员谈论那天的冒险，培养两人之间的感情。

  有时保护精灵族少女免受野蛮的同业者骚扰。

  有时安慰成长迟钝的亚马逊战士，向她伸出援手，组成小队。

  有时被女生看见自己与其他女孩相亲相爱，引来一阵醋劲。

  有时、有时、有时、有时……

  刚刚从孩童成长为少年，憧憬于英雄冒险谭的男人都会这么想。

  想跟可爱女生增进感情。想跟不同种族的美丽女性来往。

  身为年轻雄性的本色，难免怀抱一些邪念、乳臭未干的想法。

  想在地下城遇见可爱女生……订正，追求一男多女的美梦难道有错吗？

  结论。
`;

let lines = [];
TXT.split("\n").forEach((s) => {
  let line = s.replaceAll(" ", "&nbsp;");
  lines.push(line);
});
let html = HTML_TPL.replace("{CONTENT}", lines.join("<br />"));

class ArticlePage extends Component {

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: "flex-start", backgroundColor: "#CCE8CF" }}>
        <View style={{ height: 20, backgroundColor: "#999" }}>
        </View>
        <View style={{ flex: 1 }}>
          <RenderHTML contentWidth={width} source={{html: html}} />
        </View>
        <View style={{ height: 50, width: width }}>
          <View style={{ flex: 1, flexDirection: "row", alignItems:"baseline", justifyContent: "space-between", paddingLeft: 20, paddingRight: 20 }}>
            <View>
              <Text>第三章.第1节</Text>
            </View>
            <View>
              <Button title='<< 返回' onPress={()=>RootNavigation.navigate('Home')} />
            </View>
          </View>
        </View>
      </View>
    );
  }
  
}

export default connect(({ AppModel }) => ({ ...AppModel }))(ArticlePage);