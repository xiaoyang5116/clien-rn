export class Week {
    static format(day) {
        if (day == 0)
            return '一';
        else if (day == 1)
            return '二';
        else if (day == 2)
            return '三';
        else if (day == 3)
            return '四';
        else if (day == 4)
            return '五';
        else if (day == 5)
            return '六';
        else if (day == 6)
            return '日';
    }
}

export class Seasons {
    static format(month) {
        const v = month + 1;
        if (v >= 3 && v <= 5)
            return '春';
        else if (v >= 6 && v <= 8)
            return '夏';
        else if (v >= 9 && v <= 11)
            return '秋';
        else if (v == 12 || v == 1 || v == 2)
            return '冬';
        else
            return '';
    }
}

export class DayPeriod {
    static format(hours) {
        if (hours >= 0 && hours <= 2)
            return '凌晨';
        else if (hours >= 3 && hours <= 4)
            return '半夜';
        else if (hours >= 4 && hours <= 5)
            return '黎明';
        else if (hours >= 6 && hours <= 7)
            return '清晨';
        else if (hours >= 8 && hours <= 11)
            return '上午';
        else if (hours == 12)
            return '正午';
        else if (hours == 13)
            return '中午';
        else if (hours >= 14 && hours <= 16)
            return '下午';
        else if (hours >= 17 && hours <= 18)
            return '傍晚';
        else if (hours >= 19 && hours <= 22)
            return '晚上';
        else
            return '深夜';
    }
}

export class HourUtils {
    static fromMillis(millis) {
        const dt = new Date();
        dt.setTime(millis);
        return dt.getHours();
    }
}

export function toDays(now, days, hours) {
    const dt = new Date();
    dt.setTime(now + 86400 * days * 1000);
    const str = "{0}/{1}/{2} {3}:00:00".format(dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), hours);
    return Date.parse(str);
}

export function format(millis, fmt) {
    const d = new Date();
    d.setTime(millis);
    return d.format(fmt);
}

export function now() {
    return new Date().getTime();
}

export function parseFormat(str) {
    const dt = str.replace(/-/g, "/");
    return Date.parse(dt);
}

export function formatDateTime(obj) {
    if (obj == null) {
        return null
    }
    const date = new Date(obj);
    const y = 1900 + date.getYear();
    const m = "0" + (date.getMonth() + 1);
    const d = "0" + date.getDate();
    return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}

// 时间差
export function timeDiff(pre, current) {
    const preDate = new Date(pre);
    const currentDate = new Date(current);
    const Difference_In_Time = currentDate.getTime() - preDate.getTime()
    // 总秒数
    const s = Math.floor(Difference_In_Time / 1000);
    // 得到天数
    const day = Math.floor(s / (24 * 60 * 60));
    // 得到不满一天的小时数
    const hour = Math.floor((s % (24 * 60 * 60)) / (60 * 60));
    // 得到不满一小时的分钟数
    const min = Math.floor((s % (60 * 60)) / 60);
    // 得到不满一分钟的秒数
    const second = s % 60;

    let returnStr = second + "秒";
    if (min > 0) {
        returnStr = min + "分"
    }
    if (hour > 0) {
        returnStr = hour + "小时"
    }
    if (day > 0) {
        returnStr = day + "天"
    }
    return returnStr
}

// 秒 转换 00天00小时00分钟00秒
export function h_m_s_Format(s) {
    // 得到天数
    const day = Math.floor(s / (24 * 60 * 60));
    // 得到不满一天的小时数
    const hour = Math.floor((s % (24 * 60 * 60)) / (60 * 60));
    // 得到不满一小时的分钟数
    const min = Math.floor((s % (60 * 60)) / 60);
    // 得到不满一分钟的秒数
    const second = s % 60

    let returnStr = second + "秒";
    if (min > 0) {
        const miao = s - (min * 60)
        returnStr = miao > 0 ? min + "分钟" + miao + "秒" : min + "分钟"
    }
    if (hour > 0) {
        const fenzhong = Math.floor((s - (hour * 3600)) / 60);
        returnStr = fenzhong > 0 ? hour + "小时" + fenzhong + "分钟" : hour + "小时"
    }
    if (day > 0) {
        const xiaoshi = Math.floor((s - (day * 86400)) / (60 * 60))
        returnStr = xiaoshi > 0 ? day + "天" + xiaoshi + "小时" : day + "天"
    }
    return returnStr


}

// 倒计时 - 00:00:00 (小时:分钟:秒)
export function timeLeft(currentTime) {
    var h = checkTime(Math.floor(currentTime / 3600))
    var m = checkTime(Math.floor(currentTime / 60 % 60))
    var s = checkTime(Math.floor(currentTime % 60))
    return result = h + ":" + m + ":" + s
}

function checkTime(i) { // 将 0-9 的数字前面加上 0，例 1 变为 01
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}