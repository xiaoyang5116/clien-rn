
import { StyleSheet } from 'react-native';


/* 字体大小 */
const titleSize1 = 24
const titleSize2 = 18


const sharedStyles = StyleSheet.create({
    /** ================================ */
    /**             公用                 */
    /** ================================ */
    // /* 通用视图容器 */
    viewContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* 背景颜色 */
    // 米白色 #e8ddcc
    bgColor: {
        backgroundColor: '#e8ddcc',
    },

    //  ---行样式 
    /* row 居中 */
    rowCenter: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: "center",
    },
    /* row 平分 */
    rowSpaceAround: {
        flexDirection: "row",
        justifyContent: 'space-around',
        alignItems: "center",
    },
    /* row 平分 */
    rowSpaceBetween: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
    },

    /* header */
    headerTitle1: {
        fontSize: titleSize1,
    },
    headerTitle2: {
        fontSize: titleSize2,
    },

    /** ================================ */
    /**             page 容器             */
    /** ================================ */
    /* page 容器 */
    pageContainer: {
        flex: 1,
        position: 'relative',
    },

    /** ================================ */
    /**             底部                 */
    /** ================================ */
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        height: 100,
        width: '100%',
    },

    /** ================================ */
    /**             选择框                */
    /** ================================ */
    /* 位置栏 */
    positionBar: {
        alignSelf: 'stretch'
    },
    /* 对话框内位置 */
    positionLabel: {
        fontSize: 18,
        padding: 10,
        textAlign: 'left',
    },
    /* 对话框内位置 */
    datetimeLabel: {
        fontSize: 18,
        padding: 10,
    },
    /* 对话框 */
    chatContainer: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10
    },
    /* 对话项列表 */
    chatList: {
        alignSelf: 'stretch'
    },
    /* 对话框头部 */
    chatHeader: {
        fontSize: 18,
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        textAlign: 'center',
        backgroundColor: "#fff"
    },

    /** ================================ */
    /**             对话框                */
    /** ================================ */
    dlgCenter: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    dlgParent: {
        width: 300,
        height: 300,
        backgroundColor: '#FFFFFF',
        borderRadius: 10
    },
    dlgTitle: {
        fontSize: 25,
        color: '#000',
        textAlign: 'center',
    },
    dlgTitleContainer: {
        flex: 1,
        marginTop: 3,
        width: 280,
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        justifyContent: "center"
    },
    dlgContent: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center'
    },
    dlgContentContainer: {
        flex: 3,
        padding: 10,
        justifyContent: "space-around"
    },
    dlgBottomBanner: {
        width: 280,
        marginBottom: 3
    },
    /** ================================ */
    /**             旁白                 */
    /** ================================ */
    asideCenter: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: 'center',
    },
    /* 黑旁白 begin */
    asideParent1: {
        backgroundColor: '#0b0b0b',
        paddingTop: 30,
        paddingBottom: 30,
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'flex-start',
        flexFlow: "column wrap",
    },
    asideTitle1: {
        fontSize: 20,
        color: '#dfe4ea',
        textAlign: 'left',
    },
    asideContent1: {
        fontSize: 20,
        color: '#dfe4ea',
        textAlign: 'center',
    },
    /* 黑旁白 end */

    /* 白旁白 begin */
    asideParent2: {
        flexDirection: "column",
        justifyContent: "flex-end",
        paddingLeft: 50,
        paddingRight: 50,
        marginBottom: 15,
    },
    asideTitleContainer: {
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    asideContentContainer: {

    },
    asideBottomContainer: {
        justifyContent: "flex-start",
        marginTop: 15,
    },
    asideBottomBanner: {
        width: 280,
    },
    asideTitle: {
        fontSize: 24,
        color: '#000',
        textAlign: 'left',
    },
    asideContent: {
        fontSize: 24,
        color: '#000',
        textAlign: 'center'
    },
    /* 白旁白 end */
    /** ================================ */
    /**            小说阅读样式            */
    /** ================================ */

    /* 序章 begin */
    prologueContainer: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center'
    },
    prologueWrap: {
        width: 350,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        borderColor: "black",
        borderWidth: 1,
    },
    /* 序章 end */

    /* 追加弹出提示 begin */
    tooltipWrap: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
    },
    tooltip: {
        backgroundColor: "#f2f6eb",
        borderColor: "#000",
        borderWidth: 1,
    },
    tooltipContainer: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
    },
    // 道具图片
    tooltipImg: {
        width: 20,
        height: 20,
        backgroundColor: "#8eb4e3",
        transform: [{ rotate: '45deg' }],
    },
    tooltipText: {
        fontSize: 18,
        paddingLeft: 12,
    },
    /* 追加弹出提示 end */

    /* Game over begin*/
    gameOverPage: {
        flex: 1,
        paddingTop: 70,
        paddingBottom: 70,
        paddingLeft: 12,
        paddingRight: 12,
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignContent: 'center',
    },
    GameOverModal: {
        flex: 1,
        borderColor: "black",
        borderWidth: 1,
        justifyContent: 'center',
    },
    GameOverModalContent: {
        flex: 1,
        paddingLeft: 12,
        justifyContent: 'flex-start'
    },
    GameOverModalContent_Text: {
        fontSize: 24,
        paddingTop: 24,
    },
    GameOverModalButtonContainer: {
        flex: 1,
        paddingLeft: 40,
        paddingRight: 40,
        justifyContent: 'flex-start',
    },
    GameOverModalButtonContainer_Button: {
        paddingTop: 24,
    },
    /* Game over end*/

    /** ================================ */
    /**            弹窗样式               */
    /** ================================ */

    popUpPage: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    /** ================================ */
    /**          阅读器设置 弹窗的样式      */
    /** ================================ */
    readerSettingContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 198,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    readerSettingRow: {
        height: 50,
        width: "100%",
        paddingLeft: 12,
        paddingRight: 12,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: "space-between",
        alignItems: 'center',
    },
    readerSettingRow_left_item: {
        width: "16%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    readerSettingRow_right_item: {
        width: "26%",
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    readerSettingRow_box: {
        height: "100%",
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    readerSetting_border_1: {
        borderWidth: 1,
        borderRadius: 8,
        width: "100%",
        height: 35,
        lineHeight: 35,
        fontSize: 14,
        textAlign: 'center',
    },
});

export default sharedStyles;