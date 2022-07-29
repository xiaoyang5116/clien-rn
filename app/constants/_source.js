
import lo from 'lodash';
import { px2pd } from './resolution';

const _images = {
    avatar: [
        { id: 1, img: require('../../assets/avatar/1.jpg') },
        { id: 2, img: require('../../assets/avatar/2.jpg') },
        { id: 3, img: require('../../assets/avatar/3.png') },
        { id: 4, img: require('../../assets/avatar/4.png') },
        { id: 5, img: require('../../assets/avatar/5.png') },
    ],
    panel: [
        { id: 1, img: require('../../assets/bg/panel_b.png') },
        { id: 2, img: require('../../assets/bg/panel_b2.png') },
        { id: 3, img: require('../../assets/bg/panel_b3.png') },
    ],
    chapterBg: [
        { id: 'V1_1080', width: px2pd(1080), height: px2pd(1080), source: require('../../assets/chapter/V1_1080.png') },
        { id: 'V2_1080', width: px2pd(1080), height: px2pd(1799), source: require('../../assets/chapter/V2_1080.png') },
        { id: 'V3_1080', width: px2pd(1080), height: px2pd(703), source: require('../../assets/chapter/V3_1080.png') },
        { id: 'V4_1080', width: px2pd(1080), height: px2pd(1800), source: require('../../assets/chapter/V4_1080.png') },
        { id: 'V5_1080', width: px2pd(1080), height: px2pd(1800), source: require('../../assets/chapter/V5_1080.png') },
        { id: 'V6_1080', width: px2pd(1080), height: px2pd(1800), source: require('../../assets/chapter/V6_1080.png') },

        { id: 'BAI_FU', width: px2pd(750), height: px2pd(1000), source: require('../../assets/chapter/BAI_FU.webp') },
        { id: 'HUAIBIAO', width: px2pd(720), height: px2pd(720), source: require('../../assets/chapter/HUAIBIAO.webp') },
        { id: 'JIUGUAN1', width: px2pd(750), height: px2pd(422), source: require('../../assets/chapter/JIUGUAN1.webp') },
        { id: 'KEZHAN1', width: px2pd(720), height: px2pd(540), source: require('../../assets/chapter/KEZHAN1.webp') },
        { id: 'PINGCHUANFUBAICHENG', width: px2pd(1080), height: px2pd(1054), source: require('../../assets/chapter/PINGCHUANFUBAICHENG.webp') },
        { id: 'SHUIJIAOCAODUO', width: px2pd(750), height: px2pd(500), source: require('../../assets/chapter/SHUIJIAOCAODUO.webp') },
        { id: 'WAPIAN', width: px2pd(802), height: px2pd(690), source: require('../../assets/chapter/WAPIAN.webp') },
        { id: 'ZANZI', width: px2pd(720), height: px2pd(720), source: require('../../assets/chapter/ZANZI.webp') },
    ],
    btn_icon: [
        { id: 1, img: require('../../assets/button_icon/1.png'), top: 0, left: 10 },
        { id: 2, img: require('../../assets/button_icon/2.png'), top: -1, left: 10 },
        { id: 3, img: require('../../assets/button_icon/3.png'), top: 0, left: 10 },
        { id: 4, img: require('../../assets/button_icon/4.png'), top: 0, left: 10 },
        { id: 5, img: require('../../assets/button_icon/5.png'), top: 0, right: 0 },
        { id: 6, img: require('../../assets/button_icon/6.png'), top: 0, left: 10 },
        { id: 7, img: require('../../assets/button_icon/7.png'), top: 0, left: 10 },
    ]
}

// 获得头像
export const changeAvatar = (avatar) => {
    return _images.avatar.find(a => a.id == avatar).img
}

// 获取面板风格图片
export const getPanelPatternImage = (patternId) => {
    const item = _images.panel.find(e => e.id == patternId);
    return (item != undefined) ? item.img : null;
}

// 获取文章背景图片
export const getChapterImage = (imageId) => {
    return _images.chapterBg.find(e => lo.isEqual(e.id, imageId));
}

// 获取按钮 icon
export const getBtnIcon = (iconId) => {
    return _images.btn_icon.find(e => e.id === iconId)
}