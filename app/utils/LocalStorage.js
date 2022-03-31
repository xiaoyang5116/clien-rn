
import RNFS from 'react-native-fs';
import CryptoJS from 'crypto-js';

export default class LocalStorage {

  static _getRootPath() {
    return "{0}/LocalStorage".format(RNFS.DocumentDirectoryPath);
  }

  static _getFullFileName(key) {
    const filename = CryptoJS.MD5("LocalStorage_{0}".format(key)).toString();
    return "{0}/{1}.data".format(LocalStorage._getRootPath(), filename);
  }

  static async get(key, defaultValue = null) {
    const path = LocalStorage._getFullFileName(key);
    if (await RNFS.exists(path)) {
      return RNFS.readFile(path).then((content) => {
        return (content != '' ? JSON.parse(content) : defaultValue);
      });
    }
    return defaultValue;
  }

  static async set(key, value) {
    const path = LocalStorage._getFullFileName(key);
    await RNFS.mkdir(LocalStorage._getRootPath());
    return RNFS.writeFile(path, JSON.stringify(value), 'utf8')
      .then((success) => {
        return true;
      })
      .catch((err) => {
        return false;
      });
  }

  static async clear() {
    const path = LocalStorage._getRootPath();
    RNFS.unlink(path)
      .then(() => {
      })
      .catch((err) => {
      });
  }

  static async remove(...keys) {
    keys.forEach((s) => {
      const path = LocalStorage._getFullFileName(s);
      RNFS.unlink(path)
        .then(() => {
        })
        .catch((err) => {
        });
    });
  }

}
