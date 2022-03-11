
export default class SceneConfigReader {

  constructor(scenes) {
    this._scenes = scenes;
  }

  getSceneIds() {
    const ids = [];
    this._scenes.forEach((e) => {
      ids.push(e.id);
    });
    return ids;
  }

  getScene(sceneId) {
    for (let key in this._scenes) {
      const item = this._scenes[key];
      if (item.id == sceneId)
        return item;
    }
    return null;
  }

  hasScene(sceneId) {
    return (this.getScene(sceneId) != null);
  }

  getSceneVars(sceneId) {
    const scene = this.getScene(sceneId);
    if (scene == null || scene.vars == undefined)
      return null;

    const validVars = [];
    scene.vars.forEach((e) => {
      if (e.id != undefined && e.min != undefined && e.max != undefined && e.defaulValue != undefined) {
        validVars.push(e);
      }
    });
    return validVars;
  }

  getSceneActions(sceneId, actionIds) {
    const actions = [];
    const scene = this.getScene(sceneId);

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

  getSceneEvents(sceneId) {
    const scene = this.getScene(sceneId);
    if (scene == null || scene.events == undefined)
      return null;

    const validEvents = [];
    scene.events.forEach((e) => {
      if (e.type == undefined)
        return;
      if (e.varsOn != undefined 
        || e.eventActions != undefined 
        || e.nextChat != undefined 
        || e.asides != undefined) {
        validEvents.push(e);
      }
    });
    return validEvents;
  }

  getSceneAside(sceneId, asideId) {
    const scene = this.getScene(sceneId);
    if (scene == null || scene.asides == undefined)
      return null;

    for (let key in scene.asides){
      const aside = scene.asides[key];
      if (aside.id == asideId)
        return aside;
    }

    return null;
  }

  getSceneDialog(sceneId, dialogId) {
    const scene = this.getScene(sceneId);
    if (scene == null || scene.dialogs == undefined)
      return null;

    for (let key in scene.dialogs){
      const dialog = scene.dialogs[key];
      if (dialog.id == dialogId)
        return dialog;
    }

    return null;
  }

  getSceneChat(sceneId, chatId) {
    const scene = this.getScene(sceneId);
    if (scene == null || scene.chats == undefined)
      return null;

    for (let key in scene.chats) {
      const chat = scene.chats[key];
      if (chat.id == chatId)
        return chat;
    }
    return null;
  }

}
