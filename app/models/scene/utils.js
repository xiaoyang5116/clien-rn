
export class VarUtils {
    static generateVarUniqueId(sceneId, varId) {
      return "{0}/{1}".format(sceneId, varId).toUpperCase();
    }
  
    static getVar(vars, sceneId, varId) {
      const uniVarId = VarUtils.generateVarUniqueId(sceneId, varId);
      for (let key in vars) {
        const item = vars[key];
        if (item.id == uniVarId)
          return item;
      }
      return null;
    }
}
