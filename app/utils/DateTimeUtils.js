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
