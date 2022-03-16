import React, { Component } from 'react'
import { connect } from "../constants";
import {
    View,
    Text,
    ImageBackground,
    Image,
    Button,
    useWindowDimensions,
    StyleSheet,
    SafeAreaView,
    SectionList,
    StatusBar
} from 'react-native';


// 小说背景颜色
// * 河白色 #FFFFFF rgb(255, 255, 255)  
// * 杏仁黄 #FAF9DE rgb(250, 249, 222)
// * 秋叶褐 #FFF2E2 rgb(255, 242, 226)
// * 胭脂红 #FDE6E0 rgb(253, 230, 224)
// * 青草绿 #E3EDCD rgb(227, 237, 205)
// * 海天蓝 #DCE2F1 rgb(220, 226, 241)
// * 葛巾紫 #E9EBFE rgb(233, 235, 254)
// * 极光灰 #EAEAEF rgb(234, 234, 239)

const data = {
    title: "序章",
    content: "穿越做乞丐",
    backgroundColor: "#E3EDCD",
    titleFontSize: 24,
    contentFontSize: 20,
    color: "black",
    imgUrl: require('../../assets/lace2.png'),
}


// function FictionPage(props) {
//     const currentStyles = props.currentStyles;
//     const window = useWindowDimensions();
//     console.log("window",window);
//     return (
//         <View style={styles.container}>
//             {/* <Text>{`Window Dimensions: height - ${window.height}, width - ${window.width}`}</Text> */}

//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center"
//     }
// });

// export default connect((state) => ({ ...state.AppModel }))(FictionPage)


const DATA = [
    {
        title: "Main dishes",
        data: ["Pizza", "Burger", "Risotto"]
    },
    {
        title: "Sides",
        data: ["French Fries", "Onion Rings", "Fried Shrimps"]
    },
    {
        title: "Drinks",
        data: ["Water", "Coke", "Beer"]
    },
    {
        title: "Desserts",
        data: ["Cheese Cake", "Ice Cream"]
    }
];

Item = ({ title }) => (
    <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
    </View>
);

class App extends Component {
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <SectionList
                    sections={DATA}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <Item title={item} />}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.header}>{title}</Text>
                    )}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        // marginHorizontal: 16
    },
    item: {
        backgroundColor: "#f9c2ff",
        // padding: 20,
        // marginVertical: 8
    },
    header: {
        fontSize: 32,
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 24
    }
});

export default App;