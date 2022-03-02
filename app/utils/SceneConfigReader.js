
export default class SceneConfigReader {

  constructor(scenes) {
    this._scenes = scenes;
  }

  getSceneIds() {
    let ids = [];
    this._scenes.forEach((e) => {
      ids.push(e.id);
    });
    return ids;
  }

  getScene(sceneId) {
    for (let key in this._scenes) {
      let item = this._scenes[key];
      if (item.id == sceneId)
        return item;
    }
    return null;
  }

  hasScene(sceneId) {
    return (this.getScene(sceneId) != null);
  }

  getSceneVars(sceneId) {
    let scene = this.getScene(sceneId);
    if (scene == null || scene.vars == undefined)
      return null;

    let validVars = [];
    scene.vars.forEach((e) => {
      if (e.id != undefined && e.min != undefined && e.max != undefined && e.defaulValue != undefined) {
        validVars.push(e);
      }
    });
    return validVars;
  }

  getSceneActions(sceneId, actionIds) {
    let actions = [];
    let scene = this.getScene(sceneId);

    if (scene == null)
      return null;

    actionIds.forEach((e) => {
      for (let key in scene.actions) {
        let action = scene.actions[key];
        if (action.id == e) {
          actions.push(action);
        }
      }
    });

    return actions;
  }

  getSceneAside(sceneId, asideId) {
    let scene = this.getScene(sceneId);
    if (scene == null || scene.asides == undefined)
      return null;

    for (let key in scene.asides){
      let aside = scene.asides[key];
      if (aside.id == asideId)
        return aside;
    }

    return null;
  }

  getSceneDialog(sceneId, dialogId) {
    let scene = this.getScene(sceneId);
    if (scene == null || scene.dialogs == undefined)
      return null;

    for (let key in scene.dialogs){
      let dialog = scene.dialogs[key];
      if (dialog.id == dialogId)
        return dialog;
    }

    return null;
  }

  getSceneChat(sceneId, chatId) {
    let scene = this.getScene(sceneId);
    if (scene == null || scene.chats == undefined)
      return null;

    for (let key in scene.chats) {
      let chat = scene.chats[key];
      if (chat.id == chatId)
        return chat;
    }
    return null;
  }

}
