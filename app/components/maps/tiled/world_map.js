(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }
 if(typeof module === 'object' && module && module.exports) {
  module.exports = data;
 }})("world_map",
{ "compressionlevel":-1,
 "height":20,
 "infinite":false,
 "layers":[
        {
         "id":2,
         "image":"world_map\/map.jpg",
         "name":"\u56fe\u50cf\u56fe\u5c42 1",
         "opacity":1,
         "type":"imagelayer",
         "visible":true,
         "x":0,
         "y":0
        }, 
        {
         "draworder":"topdown",
         "id":5,
         "name":"\u5bf9\u8c61\u5c42 1",
         "objects":[
                {
                 "class":"",
                 "gid":1,
                 "height":296,
                 "id":10,
                 "name":"",
                 "properties":[
                        {
                         "name":"toScene",
                         "type":"string",
                         "value":"C000A_V_MAP_0_6"
                        }],
                 "rotation":0,
                 "visible":true,
                 "width":296,
                 "x":6110.94,
                 "y":5531.79
                }, 
                {
                 "class":"",
                 "gid":1,
                 "height":144.667,
                 "id":13,
                 "name":"",
                 "properties":[
                        {
                         "name":"toScene",
                         "type":"string",
                         "value":"C000A_V_MAP_-1_0"
                        }],
                 "rotation":0,
                 "visible":true,
                 "width":144.667,
                 "x":5233.73,
                 "y":6054.15
                }, 
                {
                 "class":"",
                 "gid":2,
                 "height":153.758,
                 "id":14,
                 "name":"",
                 "properties":[
                        {
                         "name":"openUI",
                         "type":"string",
                         "value":"XiuXing"
                        }],
                 "rotation":0,
                 "visible":true,
                 "width":153.758,
                 "x":6736.76,
                 "y":4966.27
                }, 
                {
                 "class":"",
                 "gid":3,
                 "height":148.727,
                 "id":15,
                 "name":"",
                 "properties":[
                        {
                         "name":"toChapter",
                         "type":"string",
                         "value":"WZXX_M1_N1_C001B"
                        }],
                 "rotation":0,
                 "visible":true,
                 "width":148.727,
                 "x":6137.76,
                 "y":6134.97
                }],
         "opacity":1,
         "properties":[
                {
                 "name":"cmd",
                 "type":"string",
                 "value":"openUI"
                }],
         "type":"objectgroup",
         "visible":true,
         "x":0,
         "y":0
        }],
 "nextlayerid":7,
 "nextobjectid":16,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tiledversion":"1.9.2",
 "tileheight":600,
 "tilesets":[
        {
         "firstgid":1,
         "source":"world_map\/1.tsx"
        }, 
        {
         "firstgid":2,
         "source":"world_map\/2.tsx"
        }, 
        {
         "firstgid":3,
         "source":"world_map\/3.tsx"
        }],
 "tilewidth":600,
 "type":"map",
 "version":"1.9",
 "width":20
});