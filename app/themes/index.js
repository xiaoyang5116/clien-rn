
export default {
    // 当前风格ID
    themeId: 0,

    // 风格列表
    themes: [
        { id: 0, title: '莎草纸', style: require('./style_normal').default, img: require('../../assets/lottery_bg2.jpg') },
        { id: 1, title: '蓝色云纹', style: require('./style_dark').default, img: require('../../assets/lottery_bg.jpg') },
        { id: 2, title: '黑白水墨', style: require('./style_dark').default, img: require('../../assets/lottery_bg.jpg') },
        { id: 3, title: '夜间风格', style: require('./style_dark').default, img: require('../../assets/lottery_bg.jpg') },
        { id: 4, title: '竹林绿色', style: require('./style_dark').default, img: require('../../assets/lottery_bg.jpg') },
        { id: 5, title: '红檀木', style: require('./style_dark').default, img: require('../../assets/lottery_bg.jpg') },
    ],
}
