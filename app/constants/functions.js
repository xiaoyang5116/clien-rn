// 支持文本格式化输出，如："{0},{1}".format(....) 或者 "{name}".format({ name: 'xxx' })
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            if (Array.isArray(args)) {
                for (var i = 0; i < args.length; i++) {
                    if (args[i] != undefined) {
                        var reg= new RegExp("({)" + i + "(})", "g");
                        result = result.replace(reg, args[i]);
                    }
                }
            } else if (typeof (args) == "object") {
                for (var key in args) {
                    if(args[key]!=undefined){
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, args[key]);
                    }
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg= new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}