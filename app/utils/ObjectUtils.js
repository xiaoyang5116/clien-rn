
import lo from 'lodash';

export default class ObjectUtils {

    static hasProperty(obj, names) {
        if (lo.isArray(names)) {
            let found = false;
            for (let key in names) {
                const item = names[key];
                if (obj[item] != undefined) {
                    found = true;
                    break;
                }
            }
            return found;
        } else if (lo.isString(names)) {
            return (obj[names] != undefined);
        }
        return false;
    }
}