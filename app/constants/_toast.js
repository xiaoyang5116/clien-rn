// ===============================
// 弹出提示相关常量和方法
// ===============================

// 下到上平滑
export const BOTTOM_TOP_SMOOTH = "BottomToTopSmooth"
// 下到上停顿
export const BOTTOM_TOP = "BottomToTop"
// 中间到上
export const CENTER_TOP = "CenterToTop"
// 上到上平滑
export const TOP_TOP_SMOOTH = "TopToTopSmooth"
// 上到上停顿
export const TOP_TOP = "TopToTop"
// 左到右
export const LEFT_RIGHT = "LeftToRight"

export const toastType = (type) => {
    switch (type) {
        case "下到上平滑":
            return BOTTOM_TOP_SMOOTH
        case "下到上停顿":
            return BOTTOM_TOP
        case "中间到上":
            return CENTER_TOP
        case "上到上平滑":
            return TOP_TOP_SMOOTH
        case "上到上停顿":
            return TOP_TOP
        case "左到右":
            return LEFT_RIGHT
        default:
            return BOTTOM_TOP
    }
};
