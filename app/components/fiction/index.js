import React, { Component } from 'react'
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
import {
    connect,
    BOTTOM_TOP_SMOOTH,
    BOTTOM_TOP,
    CENTER_TOP,
    LEFT_RIGHT
} from "../../constants";
import Template from './Template';
import Toast from '../toast/index'

let viewHightList = []
let blockIndex = 0

class Fiction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showId: null,
        };
    }

    componentDidMount() {
        if (this.props.fictionList.length === 0) {
            this.props.dispatch({
                // 异步获取数据
                type: "Fiction/getList",
                payload: {
                    chapter: this.props.chapter
                }
            });
        }
        else {
            console.log("缓存");
        }
    }

    renderItem = ({ item }) => {
        const currentShow = (item.id === this.state.showId) ? true : false
        return (
            <View
                onLayout={event => {
                    viewHightList.push({
                        height: event.nativeEvent.layout.height,
                        id: item.id,
                        template: item.template,
                        isShow: item.template === 'popUp' ? false : true,
                        showCount: 0,
                    });
                }}
            >
                <Template currentStyles={this.props.currentStyles} {...item} currentShow={currentShow} />
            </View>
        );
    };
    _navSelect = () => {
        // console.log("viewHightList", viewHightList);
        let layoutHeight = 0;
        // 需要导航的行数
        let allLines = this.props.fictionList.length;
        viewHightList.map((item, Index) => {
            if (blockIndex > Index) {
                layoutHeight += item.height;
            }
        });
        this.flatlist.scrollToOffset({ offset: layoutHeight, animated: true });
        if (allLines > blockIndex) {
            blockIndex++
        } else {
            blockIndex = 0
        }

    }

    _nextChapter = () => {
        this.props.dispatch({
            // 异步获取数据
            type: "Fiction/nextChapter",
            payload: {
                chapter: this.props.chapter
            }
        });
    }

    onViewableItemsChanged = ({ viewableItems, changed }) => {
        // console.log('viewableItems', viewableItems)
        // console.log('changed', changed)
        changed.map((item) => {
            // 获取当前模板显示的次数
            const currentItem = viewHightList.filter(i => i.id === item.item.id)[0].showCount
            // 判断 popUp 弹窗是否显示
            if ((item.item.template === "popUp") && item.isViewable && (currentItem === 0)) {
                const preViewHightList = [...viewHightList]
                viewHightList = preViewHightList.map((n) => n.id == item.item.id ? { ...n, showCount: n.showCount + 1 } : n)
                this.setState({ showId: item.item.id })
            }

            // 判断 toast 是否显示
            if ((item.item.template === "toast") && item.isViewable && (currentItem === 0)) {
                const preViewHightList = [...viewHightList]
                viewHightList = preViewHightList.map((n) => n.id == item.item.id ? { ...n, showCount: n.showCount + 1 } : n)
                this.setState({ showId: item.item.id })
            }
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    ref={(e) =>
                        this.flatlist = e
                    }
                    data={this.props.fictionList}
                    extraData={this.state.showId}
                    renderItem={this.renderItem}
                    initialNumToRender={2}
                    onEndReachedThreshold={0.1}
                    onEndReached={this._nextChapter}
                    keyExtractor={(item, index) => item.id + index}
                    ListEmptyComponent={() => {
                        return <Text>Loading...</Text>
                    }}
                    onViewableItemsChanged={this.onViewableItemsChanged}
                    ListFooterComponent={() => {
                        if (this.props.isLatestChapter) {
                            return <Text>我也是有底线的！！！</Text>
                        }
                        return <></>
                    }}
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
        backgroundColor: "#E3EDCD",
    },
});

export default connect((state) => ({ ...state.AppModel, ...state.Fiction }))(Fiction);
