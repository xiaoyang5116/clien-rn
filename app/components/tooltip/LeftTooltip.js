import React, { PureComponent } from 'react'
import { View, Text, ImageBackground, Image, Animated } from 'react-native';
// import ReactDOM from 'react-dom';
// import * as RootNavigation from '../utils/RootNavigation'
// import { DeviceEventEmitter } from 'react-native';

// 同时兼容 iOS 和 Android
// Alert.alert(
//     '弹出框标题',
//     '弹出框描述',
//     [
//         { text: '自定义按钮', onPress: () => console.log('点击了自定义按钮') },
//         {
//             text: '取消',
//             onPress: () => console.log('点击了取消按钮'),
//             style: 'cancel',
//         },
//         { text: '确认', onPress: () => console.log('点击了确认按钮') },
//     ],
//     { cancelable: false },
// );


// export default function LeftTooltip(props) {
//     const displayTime = 2000
//     // const myref = useRef()
//     // const [bottom, setBottom] = useState(90)
//     // const [opacity, setOpacity] = useState(0)


//     useEffect(() => {
//         animatedBox()
//         // let timer = setTimeout(() => {
//         //     showAlert()
//         // }, displayTime);
//         // console.log(myref);
//         return () => {
//             // DeviceEventEmitter.removeAllListeners('navigatorBack');
//             // if (timer) {
//             //     clearTimeout(timer);
//             //     timer = null;
//             // }
//         }
//     }, [])

//     // const showAlert = () => {
//     //     Alert.alert('发送数据成功')
//     // }


//     return (

//     )
// }

export default class LeftTooltip extends PureComponent {
    componentWillMount = () => {
        this.animatedBottom = new Animated.Value(90)
        this.animatedOpacity = new Animated.Value(0)
    }
    componentDidMount() {
        this.animatedBox()
    }
    animatedBox = () => {
        Animated.timing(this.animatedBottom, {
            toValue: 120,
            duration: 1000,
        }).start()
        Animated.timing(this.animatedOpacity, {
            toValue: 1,
            duration: 1000,
        }).start()
    }
    render() {
        const animatedStyle = {
            bottom: this.animatedBottom,
            opacity: this.animatedOpacity
        }
        return (
            <Animated.View style={[{
                position: 'absolute',
                width: 200,
                left: 30,
                bottom: 90,
                opacity: 0,
                backgroundColor: "pink",
            }, animatedStyle]}>
                <Text
                    // nPress={animatedBox}
                    style={{
                        fontSize: 24,
                    }}>
                    {/* {this.props.content} */}
                    left tops
                </Text>
            </Animated.View>
        )
    }
}

