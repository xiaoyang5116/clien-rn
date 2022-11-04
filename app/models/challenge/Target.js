import lo from 'lodash';

// 将属性数组的访问变换为对象属性访问 obj['xxx'] => a.xxx
function arrayObjectProxy(obj) {
    return new Proxy(obj, {
        get: function(target, propKey) {
            const found = lo.find(target.items, (e) => lo.isEqual(e.key, propKey));
            return (found != undefined) ? found.value : 0;
        },
        set: function(target, propKey, value) {
            const found = lo.find(target.items, (e) => lo.isEqual(e.key, propKey));
            if (found != undefined) {
                found.value = value;
            } else {
                target.items.push({ key: propKey, value: value });
            }
            return true;
        },
    });
}

// 生成战斗目标代理对象
export function newTarget(obj) {
    if (!lo.isObject(obj))
        return obj;

    const clone = lo.cloneDeep(obj);
    clone.attrs = arrayObjectProxy({ items: lo.isArray(clone.attrs) ? clone.attrs : [] });

    return new Proxy(clone, {
        get: function(target, propKey) {
            return Reflect.get(target, propKey);
        },
        set: function(target, propKey, value) {
            if (Reflect.has(target, propKey)) {
                if (lo.isEqual(propKey, 'attrs')) {
                    console.error("Property 'attrs' cannot reset!!!");
                    return Reflect.get(target, propKey);
                }
            }
            return Reflect.set(target, propKey, value);
        },
    });
}