import React, { useState } from 'react'

// 导入不同的追加提示模板
import BottomToTop from './BottomToTop';
import LeftToRight from './LeftToRight';


// ------追加提示
export default function (props) {
    let [isShow, setTimer] = useState(true)
    // 两秒后自动卸载追加提示
    React.useEffect(() => {
        let timer = setTimeout(() => {
            setTimer((isShow) => { isShow = false })
        }, 2000);
        return () => {
            if (timer) {
                clearTimeout(timer)
            }
        }
    }, [])

    // 点击卸载追加提示
    function isHide() {
        setTimer((isShow) => { isShow = false })
    }

    // 判断显示不同的追加提示
    if (props.type === "BottomToTop") {
        return isShow ? <BottomToTop {...props} isHide={isHide} /> : <></>
    }
    if (props.type === "LeftToRight") {
        return isShow ? <LeftToRight {...props} isHide={isHide} /> : <></>
    }
    return <></>
}
