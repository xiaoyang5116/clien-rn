
import lo from 'lodash';

export const ACTIONS_MAP = [
    { cmd: 'dialog',        handler: '__onDialogCommand' },
    { cmd: 'navigate',      handler: '__onNavigateCommand' },
    { cmd: 'chat',          handler: '__onChatCommand' },
    { cmd: 'scene',         handler: '__onSceneCommand' },
    { cmd: 'delay',         handler: '__onDelayCommand' },
    { cmd: 'copper',        handler: '__onCopperCommand' },
    { cmd: 'attrs',         handler: '__onAttrsCommand' },
    { cmd: 'xiuxing',       handler: '__onXiuXingCommand' },
    { cmd: 'wtime',         handler: '__onWorldTimeCommand' },
    { cmd: 'var',           handler: '__onVarCommand' },
    { cmd: 'useProps',      handler: '__onUsePropsCommand' },
    { cmd: 'sendProps',     handler: '__onSendPropsCommand' },
    { cmd: 'seqId',         handler: '__onSeqIdCommand' },
    { cmd: 'chapter',       handler: '__onChapterCommand' },
    { cmd: 'selector',      handler: '__onSelectorCommand' },
    { cmd: 'shock',         handler: '__onShockCommand' },
    { cmd: 'sounds',        handler: '__onSoundsCommand' },
    { cmd: 'collect',       handler: '__onCollectCommand' },
    { cmd: 'toMapPoint',    handler: '__onMapPointCommand' },
    { cmd: 'games',         handler: '__onGamesCommand' },
    { cmd: 'animations',    handler: '__onAnimationsCommand' },
    { cmd: 'dropIds',       handler: '__onDropIdsCommand' },
    { cmd: 'shop',          handler: '__onShopCommand' },
    { cmd: 'msg',           handler: '__onMsgCommand' },
    { cmd: 'openUI',        handler: '__onOpenUICommand' },
];

// 提供便捷的属性指定动作配置, 如: { varsOn: [...] }
export class PropertyActions {

    static parse(payload) {
      let allActions = [];
  
      // 生成变量变动
      if (payload.varsOn != undefined && Array.isArray(payload.varsOn)) {
        let varsActions = [];
        payload.varsOn.forEach(e => {
          varsActions.push({ id: "__var_{0}_on".format(e), cmd: 'var', params: "{0} = ON".format(e) });
        });
        allActions.push(...varsActions);
      }
      if (payload.varsOff != undefined && Array.isArray(payload.varsOff)) {
        let varsActions = [];
        payload.varsOff.forEach(e => {
          varsActions.push({ id: "__var_{0}_off".format(e), cmd: 'var', params: "{0} = OFF".format(e) });
        });
        allActions.push(...varsActions);
      }
  
      // 生成铜币修改动作
      if (payload.alterCopper != undefined && typeof(payload.alterCopper) == 'string') {
        allActions.push({ id: "__copper_{0}".format(payload.alterCopper), cmd: 'copper', params: payload.alterCopper });
      }
  
      // 生成角色属性修改动作
      if (payload.alterAttrs != undefined && Array.isArray(payload.alterAttrs)) {
        allActions.push({ id: "__attrs_{0}".format(payload.alterAttrs), cmd: 'attrs', params: payload.alterAttrs });
      }
  
      // 生成角色修行值修改动作
      if (payload.alterXiuXing != undefined && lo.isNumber(payload.alterXiuXing)) {
        allActions.push({ id: "__xiuxing_{0}".format(payload.alterXiuXing), cmd: 'xiuxing', params: payload.alterXiuXing });
      }
  
      // 生成世界时间修改动作
      if (payload.alterWorldTime != undefined && typeof(payload.alterWorldTime) == 'string') {
        allActions.push({ id: "__wtime_{0}".format(payload.alterWorldTime), cmd: 'wtime', params: payload.alterWorldTime });
      }
  
      // 使用道具
      if (payload.useProps != undefined && typeof(payload.useProps) == 'string') {
        allActions.push({ id: "__useProps_{0}".format(payload.useProps), cmd: 'useProps', params: payload.useProps });
      }
  
      // 发送道具
      if (payload.sendProps != undefined && typeof(payload.sendProps) == 'string') {
        allActions.push({ id: "__sendProps_{0}".format(payload.sendProps), cmd: 'sendProps', params: payload.sendProps });
      }
  
      // 挂机序列
      if (payload.seqId != undefined && typeof(payload.seqId) == 'string') {
        allActions.push({ id: "__seqId_{0}".format(payload.seqId), cmd: 'seqId', params: payload.seqId });
      }
  
      // 生成对话框动作
      if (payload.dialogs != undefined && Array.isArray(payload.dialogs)) {
        let dialogActions = [];
        payload.dialogs.forEach(e => {
          dialogActions.push({ id: "__dialog_{0}".format(e), cmd: 'dialog', params: e });
        });
        allActions.push(...dialogActions);
      }
  
      // 生成对话跳转动作
      if (payload.nextChat != undefined && typeof(payload.nextChat) == 'string') {
        allActions.push({ id: "__chat_{0}".format(payload.nextChat), cmd: 'chat', params: payload.nextChat });
      }
  
      // 生成切换场景动作
      if (payload.toScene != undefined && typeof(payload.toScene) == 'string') {
        allActions.push({ id: "__scene_{0}".format(payload.toScene), cmd: 'scene', params: payload.toScene });
      }
  
      // 生成切换章节动作
      if (payload.toChapter != undefined && typeof(payload.toChapter) == 'string') {
        allActions.push({ id: "__chapter_{0}".format(payload.toChapter), cmd: 'chapter', params: payload.toChapter });
      }
  
      // 选择框动作
      if (payload.selector != undefined && typeof(payload.selector) == 'object') {
        allActions.push({ id: "__selector", cmd: 'selector', params: payload.selector });
      }
  
      // 生成震屏动作
      if (payload.shock != undefined && typeof(payload.shock) == 'string') {
        allActions.push({ id: "__shock_{0}".format(payload.shock), cmd: 'shock', params: payload.shock });
      }
  
      // 生成声音播放动作
      if (payload.sounds != undefined && lo.isArray(payload.sounds)) {
        allActions.push({ id: "__sounds", cmd: 'sounds', params: payload.sounds });
      }
  
      // 生成采集动作
      if (payload.collect != undefined && !lo.isEmpty(payload.collect)) {
        allActions.push({ id: "__collect", cmd: 'collect', params: payload.collect });
      }
  
      // 生成移动场景地图动作
      if (payload.toMapPoint != undefined && lo.isArray(payload.toMapPoint)) {
        allActions.push({ id: "__toMapPoint", cmd: 'toMapPoint', params: payload.toMapPoint });
      }
  
      // 生成游戏相关动作
      if (payload.games != undefined && lo.isObject(payload.games)) {
        allActions.push({ id: "__games", cmd: 'games', params: payload.games });
      }
  
      // 生成动效相关
      if (payload.animations != undefined && (lo.isObject(payload.animations) || lo.isArray(payload.animations))) {
        allActions.push({ id: "__animations", cmd: 'animations', params: payload.animations });
      }
  
      // 生成掉落ID
      if (payload.dropIds != undefined && lo.isArray(payload.dropIds)) {
        allActions.push({ id: "__dropIds_{0}".format(payload.dropIds), cmd: 'dropIds', params: payload.dropIds });
      }
  
      // 生成商店动作
      if (payload.toShop != undefined && typeof(payload.toShop) == 'string') {
        allActions.push({ id: "__shop_{0}".format(payload.toShop), cmd: 'shop', params: payload.toShop });
      }

      // 打开UI指令
      if (payload.openUI != undefined && typeof(payload.openUI) == 'string') {
        allActions.push({ id: "__openUI_{0}".format(payload.toMsg), cmd: 'openUI', params: payload.openUI });
      }
  
      // 发送消息指令
      if (payload.toMsg != undefined && typeof(payload.toMsg) == 'object') {
        allActions.push({ id: "__msg_{0}".format(payload.toMsg), cmd: 'msg', params: payload.toMsg });
      }
  
      return allActions;
    }
    
  }
