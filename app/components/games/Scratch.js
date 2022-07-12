import { View, Text, Image } from 'react-native'
import React, { Component } from 'react'

import ScratchView from 'react-native-scratch'

import { HalfPanel } from "../panel";
import Toast from '../toast'

class Scratch extends Component {

    onImageLoadFinished = ({ id, success }) => {
        // Do something
    }

    onScratchProgressChanged = ({ value, id }) => {
        // Do domething like showing the progress to the user
    }

    onScratchDone = ({ isScratchDone, id }) => {
        // Do something
    }

    onScratchTouchStateChanged = ({ id, touchState }) => {
        // Example: change a state value to stop a containing
        // FlatList from scrolling while scratching
        this.setState({ scrollEnabled: !touchState });
    }
    componentDidMount() {
        // const cardBg = require("../../../assets/bg/lottery_bg2.jpg")
        // Toast.show(Image.resolveAssetSource(cardBg).uri, "BOTTOM_TOP", 3600)
    }

    render() {
        // console.log("ssss", require("../../../assets/bg/lottery_bg2.jpg"));
        // const cardBg = require("../../../assets/bg/lottery_bg2.jpg")
        return (
            <HalfPanel backgroundColor={"rgba(0,0,0,0.7)"}>
                <View style={{ flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 20, color: "#000" }}>刮刮乐</Text>
                    <View style={{ width: 300, height: 300 }}>
                        <ScratchView
                            id={1} // ScratchView id (Optional)
                            brushSize={50} // Default is 10% of the smallest dimension (width/height)
                            threshold={70} // Report full scratch after 70 percentage, change as you see fit. Default is 50
                            fadeOut={true} // Disable the fade out animation when scratch is done. Default is true
                            placeholderColor="#AAAAAA" // Scratch color while image is loading (or while image not present)
                            // imageUrl={Image.resolveAssetSource(cardBg).uri} // A url to your image (Optional)
                            // imageUrl={uri:Image.resolveAssetSource(cardBg).name} // A url to your image (Optional)
                            resourceName="your_image" // An image resource name (without the extension like '.png/jpg etc') in the native bundle of the app (drawble for Android, Images.xcassets in iOS) (Optional)
                            resizeMode="stretch" // Resize the image to fit or fill the scratch view. Default is stretch (cover|contain|stretch)
                            onImageLoadFinished={this.onImageLoadFinished} // Event to indicate that the image has done loading
                            // onTouchStateChanged={this.onTouchStateChangedMethod} // Touch event (to stop a containing FlatList for example)
                            onScratchProgressChanged={this.onScratchProgressChanged} // Scratch progress event while scratching
                            onScratchDone={this.onScratchDone} // 完成时调用
                        />
                    </View>
                </View>
            </HalfPanel>
        )
    }
}

export default Scratch
