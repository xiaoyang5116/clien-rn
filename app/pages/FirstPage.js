
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

import MaskModal from '../components/MaskModal';
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
最近没有多少人玩论坛了。
虽然是如此，一些小圈子的人还是喜欢类似的交流方式。

这是一个喜欢少说的人自己建立的小圈子论坛。
没有多少用户，上千人是有的，上万人不可能。
也就是海城附近几个学校谈爱好的地方，大多数人聊的的是游戏。
以及家常内容。

偶尔骂战是正常的。
年轻人时不时多来一个新话题。

今天的话题是穿越仙侠。

有些大神已经在喷起来了。

ID飘渺狐狸：
大多数的主角要不然智商在线，或莽或怂。
但是你不写穿越带入现代人的三观…那就是憨。
你想着写无穿越的，也不是不可以…但你就是一句话的事，加上就行了，为什么不呢？
信我，不穿越的那种仙侠，槽点绝对更多…

ID职业空想家：
说白了还不是大部分写手笔力不够，用穿越这个补丁来圆逻辑。
什么慢热，三观之类的全特么扯淡，难道牧X记不是原住民？没有好的思想碰撞？还不是笔力不行。
笔力不够就是笔力不够，扯什么三观慢热。
ID自由搞事：
不管怎么写，写好不就行了吗。
比如我的话，要写就写圆滑的社交技巧，还有长期以来的意淫梦想付诸实践的坚定信心找到你梦寐以求的女主了，还有可能是多个，具体参考种马。

ID天天没饭吃：
对对对
最重要的是后宫啊什么的，只要给我后宫，仙界爆炸，问题不大！
 
然后楼就逐渐歪了。
不过看的也挺有趣。

ID但愿我成精前是大佬
话说要是穿越，什么开局好啊。

ID飘渺狐狸：
什么开局都行，关键的是故事
你就写到天上去了，靠穿越也留不住人。留人的只能是开局的冲突，开局的悬念，开局的气氛。
至于穿越的手段，能配合好你这个故事就成了。

ID刘枫枫
我喜欢乱点的开局，比如被人追杀，山寨被灭，家族马上要遭到血洗什么的

ID夏小梦
还是和平开局好啊，有个好的宗门什么的，不是所有的都喜欢打斗。

ID天天没饭吃：
和现实一样，给个皇子或者富翁好吧。要我就这么选，前几天都是孤儿什么的苦大仇深，现在那么不景气。

ID脑抽的穿越者
上面弱爆了，修仙世界看的也是本事，皇子固然是爽，但是开局太高后面就不好升级了。
还是低端开局好，就算是个乞丐，我也能给你翻盘练成仙王。

记忆到此为止

这只是聊个天，怎么就搞成真穿越了呢
</pre>
`;

let html = HTML_TPL.replace("{CONTENT}", TXT);

class FirstPage extends Component {

  _onClick = (e) => {
    this.props.dispatch(action('AppModel/firstStep')());
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
        </View>
        <MaskModal />
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