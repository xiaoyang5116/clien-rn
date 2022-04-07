
import RNFS from 'react-native-fs';
import CryptoJS from 'crypto-js';
import lo from 'lodash';

export default class LocalStorage {

  // 当前使用的存档索引
  static _currentArchiveIndex = 0;

  static _getRootPath() {
    return `${RNFS.DocumentDirectoryPath}/LocalStorage`;
  }

  static _getSavePath() {
    return `${LocalStorage._getRootPath()}/${LocalStorage._currentArchiveIndex}`;
  }

  static _getFullFileName(key) {
    const md5Filename = CryptoJS.MD5(`LocalStorage_${key}`).toString();
    return `${LocalStorage._getSavePath()}/${md5Filename}.data`;
  }

  static async _getArchiveIndexes() {
    const dirList = await RNFS.readDir(LocalStorage._getRootPath())
      .then((result) => {
        const dirList = [];
        if (lo.isArray(result)) {
          result.forEach(e => {
            if (!e.isFile()) dirList.push(e.path.split(/\/([0-9]+)$/)[1]);
          });
        }
        return dirList;
      });
    return dirList.map(e => parseInt(e));
  }

  static async archive() {
    // 创建新存档目录
    const archiveIndexes = await LocalStorage._getArchiveIndexes();
    const newArchiveIndex = lo.max(archiveIndexes) + 1;
    const newArchivePath = `${LocalStorage._getRootPath()}/${newArchiveIndex}`;
    await RNFS.mkdir(newArchivePath);

    const successFiles = await RNFS.readDir(LocalStorage._getSavePath())
    .then((result) => {
      // 生成目录文件列表
      const fileList = [];
      if (lo.isArray(result)) {
        result.forEach(e => {
          if (e.isFile()) fileList.push(e.path);
        });
      }
      return Promise.all(fileList);
    })
    .then((fileList) => {
      // 复制文件到新存档目录
      const awaitAll = [];
      fileList.forEach(e => {
        const filename = e.split(/\/([^\/]+\.data)$/)[1];
        awaitAll.push(RNFS.copyFile(e, newArchivePath + `/${filename}`)
          .then(x => { return { file: filename } })
        );
      });
      return Promise.all(awaitAll);
    })
    .then((successFiles) => {
      return successFiles;
    });

    console.debug(successFiles);
  }

  static async _get(path, defaultValue = null) {
    if (await RNFS.exists(path)) {
      return RNFS.readFile(path).then((content) => {
        return (content != '' ? JSON.parse(content) : defaultValue);
      });
    }
    return defaultValue;
  }

  static async _set(fullName, value) {
    const fullPath = fullName.split(/^(.*?)\/[^\/]+\.data$/)[1];
    await RNFS.mkdir(fullPath);
    return RNFS.writeFile(fullName, JSON.stringify(value), 'utf8')
      .then((success) => {
        return true;
      })
      .catch((err) => {
        return false;
      });
  }

  static async get(key, defaultValue = null) {
    const path = LocalStorage._getFullFileName(key);
    return await LocalStorage._get(path, defaultValue);
  }

  static async set(key, value) {
    const fullName = LocalStorage._getFullFileName(key);
    return await LocalStorage._set(fullName, value);
  }

  static async clear() {
    const path = LocalStorage._getSavePath();
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
