import lo from 'lodash';

// 目标代理，将对象的属性访问转成attrs属性
export function newTarget(obj) {
    return new Proxy(obj, {
        get: function(target, propKey) {
            if (!Reflect.has(target, propKey)) {
                const found = lo.find(target.attrs, (e) => lo.isEqual(e.key, propKey));
                return (found != undefined) ? found.value : undefined;
            }
            return Reflect.get(target, propKey);
        },
        set: function(target, propKey, value) {
            if (!Reflect.has(target, propKey)) {
                const found = lo.find(target.attrs, (e) => lo.isEqual(e.key, propKey));
                if (found != undefined) {
                    found.value = value;
                } else {
                    target.attrs.push({ key: propKey, value: value });
                }
            } else {
                Reflect.set(target, propKey, value);
            }
            return value;
        }
    });
}