import lo from 'lodash';
import { getAttributeChineseName,getAttributeEnglishName } from '../../utils/AttributeUtils';


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

function arrToObject (arr) {
    return arr.reduce((pre, current) => {
        pre[current.key] = current.value
        return pre
    }, {});
}

// 生成战斗目标代理对象
export function newTarget(obj) {
    if (!lo.isObject(obj))
        return obj;

    const clone = lo.cloneDeep(obj);

    if(lo.isArray(clone.attrs)){
        // 属性key 中文 转换 英文
        const transformAttrs = clone.attrs.map(item=> getAttributeEnglishName(item.key) != undefined ? {...item,key: getAttributeEnglishName(item.key)} : item )
        clone.attrs = arrToObject(transformAttrs)
    }else{
        clone.attrs = arrayObjectProxy({ items: [] });
    }
    

    const proxy = new Proxy(clone, {
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

    // 初始化预设定值
    proxy.attrs._hp = proxy.attrs.hp;
    proxy.attrs._mp = proxy.attrs.mp;
    proxy.attrs._shield = proxy.attrs.shield;
    return proxy;
}