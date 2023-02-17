
import lo from 'lodash';
import { px2pd } from './resolution';

const _images = {
    // 头像npc
    avatar: [
        { id: 1, img: require('../../assets/avatar/1.png') },
        { id: 2, img: require('../../assets/avatar/2.png') },
        { id: 3, img: require('../../assets/avatar/3.png') },
        { id: 4, img: require('../../assets/avatar/4.png') },
        { id: 6, img: require('../../assets/avatar/6.png') },
        { id: 5, img: require('../../assets/avatar/5.png') },
        { id: 9, img: require('../../assets/avatar/9.png') },
        { id: 10, img: require('../../assets/avatar/10.png') },
        { id: 11, img: require('../../assets/avatar/11.png') },
        { id: 12, img: require('../../assets/avatar/12.png') },
        { id: 13, img: require('../../assets/avatar/13.png') },
        { id: 14, img: require('../../assets/avatar/14.png') },
    ],
     //半身像npc 
    bust: [
        { id: 1, img: require('../../assets/avatar/1.png') },
        { id: 2, img: require('../../assets/avatar/6.png') },
        { id: 3, img: require('../../assets/avatar/7.png') },
        { id: 4, img: require('../../assets/avatar/4.png') },
        { id: 8, img: require('../../assets/avatar/8.png') },
        { id: 9, img: require('../../assets/avatar/9.png') },
        { id: 10, img: require('../../assets/avatar/10.png') },
        { id: 11, img: require('../../assets/avatar/11.png') },
        { id: 12, img: require('../../assets/avatar/12.png') },
        { id: 13, img: require('../../assets/avatar/13.png') },
        { id: 14, img: require('../../assets/avatar/14.png') },
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
        { id: 'V7_1080', width: px2pd(1080), height: px2pd(1800), source: require('../../assets/chapter/V7_1080.png') },
        { id: 'BAIYUN_1080', width: px2pd(1080), height: px2pd(2400), source: require('../../assets/chapter/BAIYUN_1080.webp') },

        { id: 'HuaLing_1080', width: px2pd(1080), height: px2pd(2300), source: require('../../assets/chapter/HuaLing_1080.png') },
        { id: 'YiLing_1080', width: px2pd(1080), height: px2pd(2300), source: require('../../assets/chapter/YiLing_1080.png') },
        { id: 'JieMeiHua_1080', width: px2pd(1080), height: px2pd(2300), source: require('../../assets/chapter/JieMeiHua_1080.png') },
        { id: 'TaoLaoDengChang_1080', width: px2pd(1080), height: px2pd(2300), source: require('../../assets/chapter/TaoLaoDengChang_1080.png') },
        { id: 'TaoLaoLiKai_1080', width: px2pd(1080), height: px2pd(2300), source: require('../../assets/chapter/TaoLaoLiKai_1080.png') },
        { id: 'BaiYueGuangCeMian_1080', width: px2pd(1080), height: px2pd(2300), source: require('../../assets/chapter/BaiYueGuangCeMian_1080.png') },
        { id: 'BaiYueGuangZhengMian_1080', width: px2pd(1080), height: px2pd(2300), source: require('../../assets/chapter/BaiYueGuangZhengMian_1080.png') },
        { id: 'ZhuJueSiWang_1080', width: px2pd(1080), height: px2pd(2300), source: require('../../assets/chapter/ZhuJueSiWang_1080.png') },

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
        { id: 5, img: require('../../assets/button_icon/5.png'), top: -3, right: 2 },
        { id: 6, img: require('../../assets/button_icon/6.png'), top: 0, left: 10 },
        { id: 7, img: require('../../assets/button_icon/7.png'), top: 0, left: 10 },
        { id: 8, img: require('../../assets/button_icon/8.png'), top: 0, left: 10 },
        { id: 9, img: require('../../assets/button_icon/9.png'), top: 0, left: 10 },
        { id: 10, img: require('../../assets/button_icon/10.png'), top: 0, right: 10 },
        { id: 11, img: require('../../assets/button_icon/11.png'), top: 0, right: 10, width: px2pd(172), height: px2pd(78) },
        { id: 12, img: require('../../assets/button_icon/12.png'), top: 0, left: 10 },
        { id: 13, img: require('../../assets/button_icon/13.png'), top: 0, left: 10, width: px2pd(74), height: px2pd(76) },
        { id: 14, img: require('../../assets/button_icon/14.png'), top: 0, left: 10, width: px2pd(86), height: px2pd(80) },
        { id: 15, img: require('../../assets/button_icon/15.png'), top: 0, left: 10, width: px2pd(54), height: px2pd(43) },
        { id: 16, img: require('../../assets/button_icon/16.png'), top: 0, left: 10, width: px2pd(54), height: px2pd(43) },
        { id: 17, img: require('../../assets/button_icon/17.png'), top: 0, left: 10, width: px2pd(78), height: px2pd(78) },
        { id: 18, img: require('../../assets/button_icon/18.png'), top: 0, left: 10, width: px2pd(78), height: px2pd(78) },
     

        { id: 100, img: require('../../assets/button_icon/100.png'), top: -8, right: 3, width: px2pd(50), height: px2pd(50) },
        { id: 101, img: require('../../assets/button_icon/101.png'), top: -8, right: 3, width: px2pd(50), height: px2pd(50) },
        { id: 102, img: require('../../assets/button_icon/102.png'), top: -8, right: 3, width: px2pd(50), height: px2pd(50) },
        { id: 103, img: require('../../assets/button_icon/103.png'), top: -8, right: 3, width: px2pd(50), height: px2pd(50) },
        { id: 104, img: require('../../assets/button_icon/104.png'), top: -8, left: 3, width: px2pd(50), height: px2pd(50) },
        { id: 105, img: require('../../assets/button_icon/105.png'), top: -8, left: 3, width: px2pd(50), height: px2pd(50) },
    ],
    propIcons: [
        { id: 1, width: px2pd(160), height: px2pd(160), img: require('../../assets/props/v_1.png') },
        { id: 2, width: px2pd(160), height: px2pd(160), img: require('../../assets/props/v_1.png') },
        { id: 3, width: px2pd(160), height: px2pd(160), img: require('../../assets/props/v_1.png') },
        { id: 4, width: px2pd(160), height: px2pd(160), img: require('../../assets/props/v_1.png') },
        { id: 5, width: px2pd(160), height: px2pd(160), img: require('../../assets/props/v_1.png') },
        { id: 6, width: px2pd(160), height: px2pd(160), img: require('../../assets/props/v_1.png') },
    ],

    world_bg: [

        { id: 'ShiJieBeiJing_V1', source: require('../../assets/bg/world_bg1.png') },
    ],
    bgDialog_bgImages: [
        { id: 1, img: require('../../assets/bg/first_bg.jpg') },
        { id: 2, img: require('../../assets/bg/lottery_bg.jpg') },
        { id: 3, img: require('../../assets/bg/BAIYUN_1080.webp') },
        { id: 4, img: require('../../assets/bg/bgDialog_clock.webp') },
        { id: 5, img: require('../../assets/bg/bgfangshicanhai1.webp') },

        { id: 6, img: require('../../assets/bg/shandian1.webp') },
        { id: 7, img: require('../../assets/bg/huohuabaozha.webp') },
        { id: 8, img: require('../../assets/bg/wenquan.webp') },
        // { id: 9, img: require('../../assets/bg/wenquan2.webp') },
        { id: 10, img: require('../../assets/bg/feizhou.webp') },
        { id: 11, img: require('../../assets/bg/dongxue.webp') },

        { id: 12, img: require('../../assets/bg/lingxiujiechuanson3.webp') },
        { id: 13, img: require('../../assets/bg/lingxiujiechuanson2.webp') },
        { id: 14, img: require('../../assets/bg/lingxiujiechuanson1.webp') },
        { id: 15, img: require('../../assets/bg/lingxiujiechuanson0.webp') },

    ],
    collectBackgroundImages: [
        { name: 'YanJiang', source: require('../../assets/collect/bg/YanJiang.png') },
        { name: 'XueDi', source: require('../../assets/collect/bg/XueDi.png') },
        { name: 'CaoDi', source: require('../../assets/collect/bg/CaoDi.png') },
        { name: 'CaoDi_2', source: require('../../assets/collect/bg/CaoDi_2.png') },
        { name: 'CaoDi_3', source: require('../../assets/collect/bg/CaoDi_3.png') },
        { name: 'CaoDi_4', source: require('../../assets/collect/bg/CaoDi_4.png') },
        { name: 'HuangTu_1', source: require('../../assets/collect/bg/HuangTu_1.png') },
        { name: 'HuangTu_2', source: require('../../assets/collect/bg/HuangTu_2.png') },
        { name: 'HuangTu_3', source: require('../../assets/collect/bg/HuangTu_3.png') },
    ],
    // 成就徽章
    achievementBadgeImage: [
        { id: 1, img: require('../../assets/achievement/1.png'), },
        { id: 2, img: require('../../assets/achievement/2.png'), },
        { id: 3, img: require('../../assets/achievement/3.png'), },
    ],
    // 场景地图背景图片
    sceneMapBg: [
        // 小地图
        { id: "1", img: require('../../assets/sceneMapBg/scene_map.png'), },
        // 大地图
        // { id: "100", img: require('../../assets/button_icon/2.png'), },
    ],

    // boss icon
    bossIcon: [
        { id: 1, img: require('../../assets/games/turnLattice/boss_Icon/boss_1.png') },
        { id: 2, img: require('../../assets/games/turnLattice/boss_Icon/boss_2.png') },
    ],

    // 翻格子 地图
    turnLatticeBg: [
        { id: 0, img: require('../../assets/games/turnLattice/zhizhudonku1.png') },
        { id: 1, img: require('../../assets/games/turnLattice/zhizhudonku2.png') },
        { id: 2, img: require('../../assets/games/turnLattice/zhizhudonku3.png') },
        { id: 3, img: require('../../assets/games/turnLattice/zhizhudonku4.png') },
        // { id: 1, img: require('../../assets/games/turnLattice/zhizhudonku1.png') },
        // { id: 2, img: require('../../assets/games/turnLattice/zhizhudonku1.png') },
        // { id: 0, img: require('../../assets/games/turnLattice/zhizhudonku1.png') },
    ],
    // 技能icon
    skillIcon: [
        { id: 1, img: require('../../assets/gongFa/skill/icon/skill_icon.png') },
    ],
}

const _videos = {
    bgDialog_video: [
        { id: 1, video: require('../../assets/mp4/FLY_480x960.mp4') },
        { id: 2, video: require('../../assets/mp4/NIU_ZHUAN_SHI_KONG.mp4') },
        // { id: 1, video: require('../../assets/mp4/FLY_480x960.mp4') },
    ],
}

// 获得头像
export const changeAvatar = (avatar) => {
    return _images.avatar.find(a => a.id == avatar).img
}

// 获得 半身图片
export const getBustImg = (bust) => {
    return _images.bust.find(a => a.id == bust).img
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

// 获取道具ICON
export const getPropIcon = (iconId) => {
    return _images.propIcons.find(e => e.id == iconId);
}

// 世界背景
export const getWorldBackgroundImage = (id) => {
    return _images.world_bg.find(e => lo.isEqual(e.id, id));
}

// 获取背景对话框 背景
export const getBgDialog_bgImage = (bgImageId) => {
    return _images.bgDialog_bgImages.find(e => e.id === bgImageId).img;
}

// 获取video 视屏资源
export const getVideo = (videoId) => {
    return _videos.bgDialog_video.find(e => e.id === videoId).video;
}

// 获取采集背景图片
export const getCollectBackgroundImage = (name) => {
    return _images.collectBackgroundImages.find(e => lo.isEqual(e.name, name));
}

// 获得 成就徽章 icon
export const getAchievementBadgeImage = (id) => {
    return (_images.achievementBadgeImage.find(item => item.id === id).img)
}

// 获取 场景地图背景
export const getSceneMapBg = (id) => {
    return _images.sceneMapBg.find(e => e.id === id).img;
}

// 获取boss icon
export const getBossIcon = (id) => {
    return _images.bossIcon.find(e => e.id === id).img;
}

// 获取翻格子地图
export const getTurnLatticeBg = (id) => {
    return _images.turnLatticeBg.find(e => e.id === id).img;
}

// 获取技能 icon
export const getSkillIcon = (id) => {
    return _images.skillIcon.find(e => e.id === id).img;
}
