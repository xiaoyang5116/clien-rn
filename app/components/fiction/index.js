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
    action,
} from "../../constants";
import Template from './Template';
import Toast from '../toast/index'

let viewHightList = []
let blockIndex = 0
class Fiction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stateList: []
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

    renderItem = ({ item, index }) => {
        return (
            <View
                onLayout={event => {
                    viewHightList.push({
                        height: event.nativeEvent.layout.height,
                        id: item.id,
                        template: item.template,
                        isShow: item.isShow,
                    });
                }}
            >
                <Template currentStyles={this.props.currentStyles} {...item} />
            </View>
        );
    };
    _navSelect = () => {
        // console.log("viewHightList", viewHightList);
        console.log("fictionList", this.state.stateList);
        // let layoutHeight = 0;
        // // 需要导航的行数
        // let allLines = this.props.fictionList.length;
        // viewHightList.map((item, Index) => {
        //     if (blockIndex > Index) {
        //         layoutHeight += item.height;
        //     }
        // });
        // this.flatlist.scrollToOffset({ offset: layoutHeight, animated: true });
        // if (allLines > blockIndex) {
        //     blockIndex++
        // } else {
        //     blockIndex = 0
        // }

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
            if ((item.item.template === "popUp") && item.isViewable && !item.item.isShow) {
                console.log("item", item);
                // console.log("this.props.fictionList", this.props.fictionList);
            }
        })
    }

    render() {
        this.state.stateList = [...this.props.fictionList]
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    ref={(e) =>
                        this.flatlist = e
                    }
                    data={this.state.stateList}
                    renderItem={this.renderItem}
                    initialNumToRender={2}
                    extraData={this.props.fictionList}
                    onEndReachedThreshold={0.1}
                    onEndReached={this._nextChapter}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={() => {
                        return <Text>Loading...</Text>
                    }}
                    onViewableItemsChanged={this.onViewableItemsChanged}
                    ListFooterComponent={() => {
                        if (this.props.latestChapter) {
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
