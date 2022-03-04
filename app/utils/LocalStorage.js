
import RNFS from 'react-native-fs';
import CryptoJS from 'crypto-js';

export default class LocalStorage {

  static _getFullFileName(key) {
    let filename = CryptoJS.MD5("LocalStorage_{0}".format(key)).toString();
    return "{0}/{1}.data".format(RNFS.DocumentDirectoryPath, filename);
  }

  static async get(key, defaultValue = null) {
    let path = LocalStorage._getFullFileName(key);
    if (await RNFS.exists(path)) {
      return RNFS.readFile(path).then((content) => {
        return (content != '' ? JSON.parse(content) : defaultValue);
      });
    }
    return defaultValue;
  }

  static async set(key, value) {
    let path = LocalStorage._getFullFileName(key);    
    return RNFS.writeFile(path, JSON.stringify(value), 'utf8')
      .then((success) => {
        return true;
      })
      .catch((err) => {
        return false;
      });
  }

  static async remove(...keys) {
    keys.forEach((s) => {
      let path = LocalStorage._getFullFileName(s);
      RNFS.unlink(path)
        .then(() => {
        })
        .catch((err) => {
        });
    });
  }

}
