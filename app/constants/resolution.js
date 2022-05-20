import {
    Dimensions,
    PixelRatio,
} from 'react-native';

// 设计分辨率
const designSize = { width: 1080, height: 2400 };

// dp宽高
const { width, height } = Dimensions.get('window');

// 像素与dp的比率
const pxRatio = PixelRatio.get('window');

// 屏幕像素宽高
const pxWidth = PixelRatio.getPixelSizeForLayoutSize(width);
const pxHeight = PixelRatio.getPixelSizeForLayoutSize(height);

// 固定宽度适配
const fwWidth = designSize.width;
const fwDesignScale = fwWidth / pxWidth;
const fwHeight = fwDesignScale * pxHeight;
const fwScale = 1 / pxRatio / fwDesignScale;

export const px2pd = (px) => (px * fwScale);

console.debug(`
================================
屏幕适配信息：
    像素与dp比率: ${pxRatio}
    屏幕dp宽度: ${width}(dp)
    屏幕db高度: ${height}(dp)
    屏幕像素宽度: ${pxWidth}(px)
    屏幕像素高度: ${pxHeight}(px)
    设计分辨率: ${designSize.width} X ${designSize.height}
    固定宽度适配: 宽=${fwWidth}, 高=${fwHeight}, 比例=${fwScale}
================================
`);