
export default class ConfigParser {

  constructor(config) {
    this._mainConfig = config;
  }

  getSceneVars(sceneId) {
    let scene = this.getScene(sceneId);
    if (scene == null)
      return null;

    if (scene.vars == undefined)
      return null;

    let validVars = [];
    scene.vars.forEach((e) => {
      if (e.id != undefined && e.min != undefined && e.max != undefined && e.value != undefined) {
        validVars.push(e);
      }
    });
    return validVars;
  }

  getSceneIds() {
    let ids = [];
    this._mainConfig.scenes.forEach((e) => {
      ids.push(e.id);
    });
    return ids;
  }

  getScene(sceneId) {
    let scene = null;
    this._mainConfig.scenes.forEach((e) => {
      if (e.id == sceneId) {
        scene = e;
      }
    });
    return scene;
  }

  getNpc(npcId) {
    let npc = null;
    this._mainConfig.npcs.forEach((e) => {
      if (e.id == npcId) {
        npc = e;
      }
    });
    return npc;
  }

  getNpcVars(npcId) {
    let npc = this.getNpc(npcId);
    if (npc == null)
      return null;

    if (npc.vars == undefined)
      return null;

    let validVars = [];
    npc.vars.forEach((e) => {
      if (e.id != undefined && e.min != undefined && e.max != undefined && e.value != undefined) {
        validVars.push(e);
      }
    });
    return validVars;
  }

  getNpcIds() {
    let ids = [];
    this._mainConfig.npcs.forEach((e) => {
      ids.push(e.id);
    });
    return ids;
  }

  getChat(chatId) {
    let chats = this._mainConfig.chats;
    for (let key in chats) {
      let chat = chats[key];
      if (chat.id == chatId)
        return chat;
    }
    return null;
  }

  getScenesNum() {
    return this._mainConfig.scenes.length;
  }

  getNpcsNum() {
    return this._mainConfig.npcs.length;
  }

  getChatsNum() {
    return this._mainConfig.chats.length;
  }

}
