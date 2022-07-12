import { View, Text, Image } from 'react-native'
import React, { Component } from 'react'

import ScratchView from 'react-native-scratch'

import { HalfPanel } from "../panel";
import Toast from '../toast'
import { TextButton } from '../../constants/custom-ui';

class Scratch extends Component {

    onImageLoadFinished = ({ id, success }) => {
        // Do something
    }

    onScratchProgressChanged = ({ value, id }) => {
        // Do domething like showing the progress to the user
    }

    onScratchDone = ({ isScratchDone, id }) => {
        // Do something
        // Toast.show("ssss")
    }

    onScratchTouchStateChanged = ({ id, touchState }) => {
        // Example: change a state value to stop a containing
        // FlatList from scrolling while scratching
        // this.setState({ scrollEnabled: !touchState });
    }
    componentDidMount() {
        // const cardBg = require("../../../assets/bg/lottery_bg2.jpg")
        // Toast.show(Image.resolveAssetSource(cardBg).uri, "BOTTOM_TOP", 3600)
    }

    render() {
        // console.log("ssss", require("../../../assets/bg/lottery_bg2.jpg"));
        // const cardBg = require("../../../assets/bg/lottery_bg2.jpg")
        return (
            <HalfPanel backgroundColor={"rgba(0,0,0,0.7)"} height={"70%"}>
                <View style={{ flex: 1, justifyContent: "space-around", alignItems: "center" }}>
                    <Text style={{ fontSize: 24, color: "#ccc" }}>刮刮乐</Text>
                    <View style={{ width: 300, height: 300, overflow: "hidden" }}>
                        <ScratchView
                            id={1} // ScratchView id (Optional)
                            brushSize={50} // Default is 10% of the smallest dimension (width/height)
                            threshold={45} // Report full scratch after 70 percentage, change as you see fit. Default is 50
                            fadeOut={true} // Disable the fade out animation when scratch is done. Default is true
                            placeholderColor="#AAAAAA" // Scratch color while image is loading (or while image not present)
                            imageUrl={"https://s2.loli.net/2022/07/12/jr2siQNAknW3Fpz.jpg"} // A url to your image (Optional)
                            resourceName="your_image" // An image resource name (without the extension like '.png/jpg etc') in the native bundle of the app (drawble for Android, Images.xcassets in iOS) (Optional)
                            resizeMode="stretch" // Resize the image to fit or fill the scratch view. Default is stretch (cover|contain|stretch)
                            onImageLoadFinished={this.onImageLoadFinished} // Event to indicate that the image has done loading
                            // onTouchStateChanged={this.onTouchStateChangedMethod} // Touch event (to stop a containing FlatList for example)
                            onScratchProgressChanged={this.onScratchProgressChanged} // Scratch progress event while scratching
                            onScratchDone={this.onScratchDone} // 完成时调用
                        />
                        <Image style={{ width: "100%", height: "100%", zIndex: -1 }} source={require("../../../assets/avatar/1.jpg")} />
                    </View>
                    <TextButton title={"退出"} onPress={this.props.onClose} />
                </View>
            </HalfPanel>
        )
    }
}

export default Scratch
