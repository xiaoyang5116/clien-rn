
import RNFS from 'react-native-fs';
import CryptoJS from 'crypto-js';
import lo from 'lodash';
import * as DateTime from '../utils/DateTimeUtils';

export default class LocalStorage {

  // 当前本地存储元数据
  static metadata = null;

  static _getRootPath() {
    return `${RNFS.DocumentDirectoryPath}/LocalStorage`;
  }

  static _getSavePath() {
    return `${LocalStorage._getRootPath()}/${LocalStorage.metadata.currentArchiveIndex}`;
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

  static async _loadMetadata() {
    const metadataFilePath = `${LocalStorage._getRootPath()}/metadata.data`;
    return await LocalStorage._get(metadataFilePath, { 
      currentArchiveIndex: 0, 
      descriptors: [],
    });
  }

  static async _writeMetadata(data) {
    const metadataFilePath = `${LocalStorage._getRootPath()}/metadata.data`;
    return await LocalStorage._set(metadataFilePath, data);
  }

  static async select(archiveId) {
    await LocalStorage.init();
    const archiveIndexes = await LocalStorage._getArchiveIndexes();
    if (archiveIndexes.find(e => e == archiveId) != undefined) {
      LocalStorage.metadata.currentArchiveIndex = archiveId;
      await LocalStorage._writeMetadata(LocalStorage.metadata);
    }
  }

  static async init() {
    if (LocalStorage.metadata != null)
      return;
    LocalStorage.metadata = await LocalStorage._loadMetadata();
  }

  static async archive(desc = {}) {
    await LocalStorage.init();

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

    const descriptor = {
      id: newArchiveIndex,
      dt: DateTime.now(),
      files: successFiles,
      desc: desc,
    };

    LocalStorage.metadata.currentArchiveIndex = newArchiveIndex;
    LocalStorage.metadata.descriptors.push(descriptor);
    await LocalStorage._writeMetadata(LocalStorage.metadata);
    return newArchiveIndex;
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
    await LocalStorage.init();
    const path = LocalStorage._getFullFileName(key);
    return await LocalStorage._get(path, defaultValue);
  }

  static async set(key, value) {
    await LocalStorage.init();
    const fullName = LocalStorage._getFullFileName(key);
    return await LocalStorage._set(fullName, value);
  }

  static async clear() {
    await LocalStorage.init();
    const path = LocalStorage._getSavePath();
    RNFS.unlink(path)
      .then(() => {
      })
      .catch((err) => {
      });
  }

}
