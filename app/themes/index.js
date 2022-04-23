
export default {
    // 当前风格ID
    themeId: 0,

    // 风格列表
    themes: [
        { id: 0, title: '白天模式', style: require('./style_normal').default, img: require('../../assets/lottery_bg2.jpg') },
        { id: 1, title: '夜晚模式', style: require('./style_dark').default, img: require('../../assets/lottery_bg.jpg') },
    ],
}
