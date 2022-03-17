import React, { Component, useState } from 'react'
import {
    View,
    Text,
    ImageBackground,
    Image,
    Button,
    getWindowSize,
    StyleSheet,
    SafeAreaView,
    SectionList,
    FlatList,
    StatusBar,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import Template from './Template';

let viewHightList = []
let blockIndex = 0
class Fiction extends Component {
    state = {
        selectedId: null,
        dataList: [
            {
                id: "asdf",
                template: "ChapterTemplate",
                title: "序章",
                data: '穿越做乞丐',
            },
            {
                id: "a431sdf",
                template: "TextTemplate",
                title: "第一章",
                data: '<p>目前的普通阅读形式需要互动，简单的说，作者读到那个地方，然后出选项。</p><p class="MsoNormal">这个道理很简单，实现则需要个判断，判断用户究竟阅读到了什么位置。</p><p class="MsoNormal">目前参照有两种思路</p><p class="MsoNormal"><span>1</span><span>玩家需要点击，点击一次，出一段话，这样就可以知道互动的具体精确位置。</span></p><p class="MsoNormal">这种的好处是绝对准确，缺点是如果是长文本，就需要玩家一直点一直点，或者设置自动翻页。</p><p class="MsoNormal">而自动翻页，却等于判断用户阅读位置的思路被打破。</p><p class="MsoNormal">当然，这种模式是用的最多的，比较成熟，目前考虑的是局部使用。</p><p class="MsoNormal"><span>2<span><span>目前的思路，把阅读的一个章节拆分成几个小页面，以表格的形式展出。</span></p><p class="MsoNormal">当用户滑动表格位置，以表格的边界来界定用户的阅读位置，穿插上互动按钮，这就是下文要描述的内容。</p>'
            },
            {
                id: "as3423df",
                template: "ChapterTemplate",
                title: "第3章",
                data: ["French Fries"]
            },
            {
                id: "ae4esdf",
                template: "TextTemplate",
                title: "第一章",
                data: '<p class="MsoNormal">范德萨发撒打发士大夫，简单的说，作者读到那个地方，然后出选项。</p><p class="MsoNormal">这个道理很简单，实现则需要个判断，判断用户究竟阅读到了什么位置。</p><p class="MsoNormal">目前参照有两种思路</p><p class="MsoNormal"><span>1</span><span>玩家需要点击，点击一次，出一段话，这样就可以知道互动的具体精确位置。</span></p><p class="MsoNormal">这种的好处是绝对准确，缺点是如果是长文本，就需要玩家一直点一直点，或者设置自动翻页。</p><p class="MsoNormal">而自动翻页，却等于判断用户阅读位置的思路被打破。</p><p class="MsoNormal">当然，这种模式是用的最多的，比较成熟，目前考虑的是局部使用。</p><p class="MsoNormal"><span>2<span><span>目前的思路，把阅读的一个章节拆分成几个小页面，以表格的形式展出。</span></p><p class="MsoNormal">当用户滑动表格位置，以表格的边界来界定用户的阅读位置，穿插上互动按钮，这就是下文要描述的内容。</p>'
            },
        ]
    }

    renderItem = ({ item }) => {
        return (
            <View
                onLayout={event => {
                    viewHightList.push({
                        height: event.nativeEvent.layout.height,
                        index: item.id
                    });
                    // console.log("viewHightList", viewHightList);
                }}
            >
                <Template currentStyles={this.props.currentStyles} {...item} />
            </View>
        );
    };
    _navSelect = () => {
        let layoutHeight = 0;
        // 需要导航的行数
        let allLines = this.state.dataList.length;
        viewHightList.map((item, Index) => {
            if (blockIndex > Index) {
                layoutHeight += item.height;
            }
        });
        // if (index == 0) {
        //     layoutHeight = 0;
        // } else {
        //     layoutHeight = layoutHeight + px2dp(220);
        // }

        this.flatlist.scrollToOffset({ offset: layoutHeight, animated: true });
        if (allLines > blockIndex) {
            blockIndex++
        } else {
            blockIndex = 0
        }

    }
    render() {
        const { dataList } = this.state
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    ref={(e) =>
                        this.flatlist = e
                    }
                    data={dataList}
                    renderItem={this.renderItem}
                    initialNumToRender={1}
                    keyExtractor={(item) => {
                        return item.id
                    }}
                    extraData={dataList}
                />
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    width: "100%",
                    backgroundColor: "pink"
                }}>
                    <Button title='下一块' onPress={this._navSelect} />
                </View>
            </SafeAreaView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
    },
});

export default Fiction;
