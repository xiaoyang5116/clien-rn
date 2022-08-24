
import lo from 'lodash';

let PROGRESS_UNIQUE_ID = 1230000;

// 场景配置注入相应的属性
export class ScenePropertyInjectBuilder {

    static injectProgressId(scene) {
      // 标注进度条缺失的唯一ID
      if (scene.chats != undefined) {
        for (let key in scene.chats) {
          const chat = scene.chats[key];
          if (chat.options != undefined) {
            chat.options.forEach(o => {
              if (o.duration != undefined 
                && o.duration > 0 
                && o.progressId == undefined) {
                o.progressId = PROGRESS_UNIQUE_ID++;
              }
            });
          }
        }
      }
    }
  
    static injectSceneId(scene) {
      const sceneId = scene.id;
      if (lo.isArray(scene.events)) {
        scene.events.forEach(e => e.__sceneId = sceneId);
      }
      if (lo.isArray(scene.actions)) {
        scene.actions.forEach(e => e.__sceneId = sceneId);
      }
      if (lo.isArray(scene.chats)) {
        scene.chats.forEach(e => {
          if (lo.isArray(e.options)) {
            e.options.forEach(x => x.__sceneId = sceneId);
          }
        });
      }
      if (lo.isArray(scene.dialogs)) {
        scene.dialogs.forEach(e => e.__sceneId = sceneId);
      }
    }
  
}