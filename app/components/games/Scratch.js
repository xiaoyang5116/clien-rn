import { View, Text, Image, StyleSheet } from 'react-native'
import React, { Component } from 'react'

import ScratchView from 'react-native-scratcher'
import {
    AppDispath,
    action,
    connect,
    EventKeys
} from '../../constants';

import Toast from '../toast'
import { TextButton } from '../../constants/custom-ui';


const imgData = [
    {
        name: "凌云要诀",
        vague: "https://s2.loli.net/2022/07/23/QkVvayY8gZqWNfm.png",
        bottomImg: require('../../../assets/games/scratch/miji_A2.png')
    },
    {
        name: "思无邪",
        vague: "https://s2.loli.net/2022/07/23/Qlp9kdaY8mCnw2Z.png",
        bottomImg: require('../../../assets/games/scratch/miji_B2.png')
    },
    {
        name: "白城笑话大全",
        vague: "https://s2.loli.net/2022/07/23/9VYr3HFRCcagfhe.png",
        bottomImg: require('../../../assets/games/scratch/miji_C2.png')
    }
]

class Scratch extends Component {
    constructor(props) {
        super(props);
        this.timer = null
        this.state = {
            isScratchDone: false,
            imgName: this.props.imgName
        }
        this.timer = null
    }

    onImageLoadFinished = ({ id, success }) => {
        // Do something
    }

    onScratchProgressChanged = ({ value, id }) => {
        // Do domething like showing the progress to the user
    }

    onScratchDone = ({ isScratchDone, id }) => {
        this.setState({ isScratchDone: true })
        this.props.dispatch(action('SceneModel/processActions')({ __sceneId: this.props.sceneId, ...this.props }))
        this.timer = setTimeout(() => {
            this.onClose()
        }, 1000)
    }

    onClose = () => {
        this.props.onClose()
    }

    onScratchTouchStateChanged = ({ id, touchState }) => {
        // Example: change a state value to stop a containing
        // FlatList from scrolling while scratching
        // this.setState({ scrollEnabled: !touchState });
    }
    componentWillUnmount() {
        clearTimeout(this.timer)
    }

    render() {
        if (this.state.imgName === undefined) return null
        const currentImgData = imgData.find(item => item.name === this.state.imgName)
        return (
            <View style={styles.container}>
                <View style={{ width: '90%', height: '70%', justifyContent: "space-around", alignItems: "center" }}>
                    <Text style={{ fontSize: 24, color: "#ccc" }}>擦拭查看</Text>
                    <View style={{ width: 300, height: 300, overflow: "hidden" }} pointerEvents={this.state.isScratchDone ? "none" : "auto"}>
                        {/* <View style={{ width: 300, height: 300, overflow: "hidden" }}> */}
                        <ScratchView
                            id={1} // ScratchView id (Optional)
                            brushSize={50} // Default is 10% of the smallest dimension (width/height)
                            threshold={45} // Report full scratch after 70 percentage, change as you see fit. Default is 50
                            fadeOut={true} // Disable the fade out animation when scratch is done. Default is true
                            placeholderColor="#AAAAAA" // Scratch color while image is loading (or while image not present)
                            imageUrl={currentImgData.vague} // A url to your image (Optional)
                            resourceName="your_image" // An image resource name (without the extension like '.png/jpg etc') in the native bundle of the app (drawble for Android, Images.xcassets in iOS) (Optional)
                            resizeMode="stretch" // Resize the image to fit or fill the scratch view. Default is stretch (cover|contain|stretch)
                            onImageLoadFinished={this.onImageLoadFinished} // 图片 loading 完成时调用
                            // onTouchStateChanged={this.onScratchTouchStateChanged} // 判断是否在刮,Touch event (to stop a containing FlatList for example)
                            // onScratchProgressChanged={this.onScratchProgressChanged} // 刮时的进度
                            onScratchDone={this.onScratchDone} // 刮完时调用
                        />
                        <Image style={{ width: "100%", height: "100%", zIndex: -1 }} source={currentImgData.bottomImg} />
                    </View>
                    <TextButton title={"退出"} onPress={this.props.onClose} />
                </View>
            </View>
        )
    }
}

export default connect((state) => ({ ...state.SceneModel }))(Scratch);

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: "rgba(0,0,0,0.7)",
        zIndex: 99,
    }
})