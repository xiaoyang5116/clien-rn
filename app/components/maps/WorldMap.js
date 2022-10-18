
import React from 'react';
import PropTypes from 'prop-types';

import {
  View,
} from '../../constants/native-ui';

import {
  Animated,
  PanResponder,
} from 'react-native';

import lo from 'lodash';
import FastImage from 'react-native-fast-image';
import { getWindowHeight, getWindowWidth, px2pd } from '../../constants/resolution';

const MAP_ROWS = 20; 
const MAP_COLUMNS = 20;
const MAP_GRID_WIDTH = px2pd(600)
const MAP_GRID_HEIGHT = px2pd(600);

const MAP_DATA = [
  require('../../../assets/maps/world/map_01.jpg'),
  require('../../../assets/maps/world/map_02.jpg'),
  require('../../../assets/maps/world/map_03.jpg'),
  require('../../../assets/maps/world/map_04.jpg'),
  require('../../../assets/maps/world/map_05.jpg'),
  require('../../../assets/maps/world/map_06.jpg'),
  require('../../../assets/maps/world/map_07.jpg'),
  require('../../../assets/maps/world/map_08.jpg'),
  require('../../../assets/maps/world/map_09.jpg'),
  require('../../../assets/maps/world/map_10.jpg'),
  require('../../../assets/maps/world/map_11.jpg'),
  require('../../../assets/maps/world/map_12.jpg'),
  require('../../../assets/maps/world/map_13.jpg'),
  require('../../../assets/maps/world/map_14.jpg'),
  require('../../../assets/maps/world/map_15.jpg'),
  require('../../../assets/maps/world/map_16.jpg'),
  require('../../../assets/maps/world/map_17.jpg'),
  require('../../../assets/maps/world/map_18.jpg'),
  require('../../../assets/maps/world/map_19.jpg'),
  require('../../../assets/maps/world/map_20.jpg'),
  require('../../../assets/maps/world/map_21.jpg'),
  require('../../../assets/maps/world/map_22.jpg'),
  require('../../../assets/maps/world/map_23.jpg'),
  require('../../../assets/maps/world/map_24.jpg'),
  require('../../../assets/maps/world/map_25.jpg'),
  require('../../../assets/maps/world/map_26.jpg'),
  require('../../../assets/maps/world/map_27.jpg'),
  require('../../../assets/maps/world/map_28.jpg'),
  require('../../../assets/maps/world/map_29.jpg'),
  require('../../../assets/maps/world/map_30.jpg'),
  require('../../../assets/maps/world/map_31.jpg'),
  require('../../../assets/maps/world/map_32.jpg'),
  require('../../../assets/maps/world/map_33.jpg'),
  require('../../../assets/maps/world/map_34.jpg'),
  require('../../../assets/maps/world/map_35.jpg'),
  require('../../../assets/maps/world/map_36.jpg'),
  require('../../../assets/maps/world/map_37.jpg'),
  require('../../../assets/maps/world/map_38.jpg'),
  require('../../../assets/maps/world/map_39.jpg'),
  require('../../../assets/maps/world/map_40.jpg'),
  require('../../../assets/maps/world/map_41.jpg'),
  require('../../../assets/maps/world/map_42.jpg'),
  require('../../../assets/maps/world/map_43.jpg'),
  require('../../../assets/maps/world/map_44.jpg'),
  require('../../../assets/maps/world/map_45.jpg'),
  require('../../../assets/maps/world/map_46.jpg'),
  require('../../../assets/maps/world/map_47.jpg'),
  require('../../../assets/maps/world/map_48.jpg'),
  require('../../../assets/maps/world/map_49.jpg'),
  require('../../../assets/maps/world/map_50.jpg'),
  require('../../../assets/maps/world/map_51.jpg'),
  require('../../../assets/maps/world/map_52.jpg'),
  require('../../../assets/maps/world/map_53.jpg'),
  require('../../../assets/maps/world/map_54.jpg'),
  require('../../../assets/maps/world/map_55.jpg'),
  require('../../../assets/maps/world/map_56.jpg'),
  require('../../../assets/maps/world/map_57.jpg'),
  require('../../../assets/maps/world/map_58.jpg'),
  require('../../../assets/maps/world/map_59.jpg'),
  require('../../../assets/maps/world/map_60.jpg'),
  require('../../../assets/maps/world/map_61.jpg'),
  require('../../../assets/maps/world/map_62.jpg'),
  require('../../../assets/maps/world/map_63.jpg'),
  require('../../../assets/maps/world/map_64.jpg'),
  require('../../../assets/maps/world/map_65.jpg'),
  require('../../../assets/maps/world/map_66.jpg'),
  require('../../../assets/maps/world/map_67.jpg'),
  require('../../../assets/maps/world/map_68.jpg'),
  require('../../../assets/maps/world/map_69.jpg'),
  require('../../../assets/maps/world/map_70.jpg'),
  require('../../../assets/maps/world/map_71.jpg'),
  require('../../../assets/maps/world/map_72.jpg'),
  require('../../../assets/maps/world/map_73.jpg'),
  require('../../../assets/maps/world/map_74.jpg'),
  require('../../../assets/maps/world/map_75.jpg'),
  require('../../../assets/maps/world/map_76.jpg'),
  require('../../../assets/maps/world/map_77.jpg'),
  require('../../../assets/maps/world/map_78.jpg'),
  require('../../../assets/maps/world/map_79.jpg'),
  require('../../../assets/maps/world/map_80.jpg'),
  require('../../../assets/maps/world/map_81.jpg'),
  require('../../../assets/maps/world/map_82.jpg'),
  require('../../../assets/maps/world/map_83.jpg'),
  require('../../../assets/maps/world/map_84.jpg'),
  require('../../../assets/maps/world/map_85.jpg'),
  require('../../../assets/maps/world/map_86.jpg'),
  require('../../../assets/maps/world/map_87.jpg'),
  require('../../../assets/maps/world/map_88.jpg'),
  require('../../../assets/maps/world/map_89.jpg'),
  require('../../../assets/maps/world/map_90.jpg'),
  require('../../../assets/maps/world/map_91.jpg'),
  require('../../../assets/maps/world/map_92.jpg'),
  require('../../../assets/maps/world/map_93.jpg'),
  require('../../../assets/maps/world/map_94.jpg'),
  require('../../../assets/maps/world/map_95.jpg'),
  require('../../../assets/maps/world/map_96.jpg'),
  require('../../../assets/maps/world/map_97.jpg'),
  require('../../../assets/maps/world/map_98.jpg'),
  require('../../../assets/maps/world/map_99.jpg'),
  require('../../../assets/maps/world/map_100.jpg'),
  require('../../../assets/maps/world/map_101.jpg'),
  require('../../../assets/maps/world/map_102.jpg'),
  require('../../../assets/maps/world/map_103.jpg'),
  require('../../../assets/maps/world/map_104.jpg'),
  require('../../../assets/maps/world/map_105.jpg'),
  require('../../../assets/maps/world/map_106.jpg'),
  require('../../../assets/maps/world/map_107.jpg'),
  require('../../../assets/maps/world/map_108.jpg'),
  require('../../../assets/maps/world/map_109.jpg'),
  require('../../../assets/maps/world/map_110.jpg'),
  require('../../../assets/maps/world/map_111.jpg'),
  require('../../../assets/maps/world/map_112.jpg'),
  require('../../../assets/maps/world/map_113.jpg'),
  require('../../../assets/maps/world/map_114.jpg'),
  require('../../../assets/maps/world/map_115.jpg'),
  require('../../../assets/maps/world/map_116.jpg'),
  require('../../../assets/maps/world/map_117.jpg'),
  require('../../../assets/maps/world/map_118.jpg'),
  require('../../../assets/maps/world/map_119.jpg'),
  require('../../../assets/maps/world/map_120.jpg'),
  require('../../../assets/maps/world/map_121.jpg'),
  require('../../../assets/maps/world/map_122.jpg'),
  require('../../../assets/maps/world/map_123.jpg'),
  require('../../../assets/maps/world/map_124.jpg'),
  require('../../../assets/maps/world/map_125.jpg'),
  require('../../../assets/maps/world/map_126.jpg'),
  require('../../../assets/maps/world/map_127.jpg'),
  require('../../../assets/maps/world/map_128.jpg'),
  require('../../../assets/maps/world/map_129.jpg'),
  require('../../../assets/maps/world/map_130.jpg'),
  require('../../../assets/maps/world/map_131.jpg'),
  require('../../../assets/maps/world/map_132.jpg'),
  require('../../../assets/maps/world/map_133.jpg'),
  require('../../../assets/maps/world/map_134.jpg'),
  require('../../../assets/maps/world/map_135.jpg'),
  require('../../../assets/maps/world/map_136.jpg'),
  require('../../../assets/maps/world/map_137.jpg'),
  require('../../../assets/maps/world/map_138.jpg'),
  require('../../../assets/maps/world/map_139.jpg'),
  require('../../../assets/maps/world/map_140.jpg'),
  require('../../../assets/maps/world/map_141.jpg'),
  require('../../../assets/maps/world/map_142.jpg'),
  require('../../../assets/maps/world/map_143.jpg'),
  require('../../../assets/maps/world/map_144.jpg'),
  require('../../../assets/maps/world/map_145.jpg'),
  require('../../../assets/maps/world/map_146.jpg'),
  require('../../../assets/maps/world/map_147.jpg'),
  require('../../../assets/maps/world/map_148.jpg'),
  require('../../../assets/maps/world/map_149.jpg'),
  require('../../../assets/maps/world/map_150.jpg'),
  require('../../../assets/maps/world/map_151.jpg'),
  require('../../../assets/maps/world/map_152.jpg'),
  require('../../../assets/maps/world/map_153.jpg'),
  require('../../../assets/maps/world/map_154.jpg'),
  require('../../../assets/maps/world/map_155.jpg'),
  require('../../../assets/maps/world/map_156.jpg'),
  require('../../../assets/maps/world/map_157.jpg'),
  require('../../../assets/maps/world/map_158.jpg'),
  require('../../../assets/maps/world/map_159.jpg'),
  require('../../../assets/maps/world/map_160.jpg'),
  require('../../../assets/maps/world/map_161.jpg'),
  require('../../../assets/maps/world/map_162.jpg'),
  require('../../../assets/maps/world/map_163.jpg'),
  require('../../../assets/maps/world/map_164.jpg'),
  require('../../../assets/maps/world/map_165.jpg'),
  require('../../../assets/maps/world/map_166.jpg'),
  require('../../../assets/maps/world/map_167.jpg'),
  require('../../../assets/maps/world/map_168.jpg'),
  require('../../../assets/maps/world/map_169.jpg'),
  require('../../../assets/maps/world/map_170.jpg'),
  require('../../../assets/maps/world/map_171.jpg'),
  require('../../../assets/maps/world/map_172.jpg'),
  require('../../../assets/maps/world/map_173.jpg'),
  require('../../../assets/maps/world/map_174.jpg'),
  require('../../../assets/maps/world/map_175.jpg'),
  require('../../../assets/maps/world/map_176.jpg'),
  require('../../../assets/maps/world/map_177.jpg'),
  require('../../../assets/maps/world/map_178.jpg'),
  require('../../../assets/maps/world/map_179.jpg'),
  require('../../../assets/maps/world/map_180.jpg'),
  require('../../../assets/maps/world/map_181.jpg'),
  require('../../../assets/maps/world/map_182.jpg'),
  require('../../../assets/maps/world/map_183.jpg'),
  require('../../../assets/maps/world/map_184.jpg'),
  require('../../../assets/maps/world/map_185.jpg'),
  require('../../../assets/maps/world/map_186.jpg'),
  require('../../../assets/maps/world/map_187.jpg'),
  require('../../../assets/maps/world/map_188.jpg'),
  require('../../../assets/maps/world/map_189.jpg'),
  require('../../../assets/maps/world/map_190.jpg'),
  require('../../../assets/maps/world/map_191.jpg'),
  require('../../../assets/maps/world/map_192.jpg'),
  require('../../../assets/maps/world/map_193.jpg'),
  require('../../../assets/maps/world/map_194.jpg'),
  require('../../../assets/maps/world/map_195.jpg'),
  require('../../../assets/maps/world/map_196.jpg'),
  require('../../../assets/maps/world/map_197.jpg'),
  require('../../../assets/maps/world/map_198.jpg'),
  require('../../../assets/maps/world/map_199.jpg'),
  require('../../../assets/maps/world/map_200.jpg'),
  require('../../../assets/maps/world/map_201.jpg'),
  require('../../../assets/maps/world/map_202.jpg'),
  require('../../../assets/maps/world/map_203.jpg'),
  require('../../../assets/maps/world/map_204.jpg'),
  require('../../../assets/maps/world/map_205.jpg'),
  require('../../../assets/maps/world/map_206.jpg'),
  require('../../../assets/maps/world/map_207.jpg'),
  require('../../../assets/maps/world/map_208.jpg'),
  require('../../../assets/maps/world/map_209.jpg'),
  require('../../../assets/maps/world/map_210.jpg'),
  require('../../../assets/maps/world/map_211.jpg'),
  require('../../../assets/maps/world/map_212.jpg'),
  require('../../../assets/maps/world/map_213.jpg'),
  require('../../../assets/maps/world/map_214.jpg'),
  require('../../../assets/maps/world/map_215.jpg'),
  require('../../../assets/maps/world/map_216.jpg'),
  require('../../../assets/maps/world/map_217.jpg'),
  require('../../../assets/maps/world/map_218.jpg'),
  require('../../../assets/maps/world/map_219.jpg'),
  require('../../../assets/maps/world/map_220.jpg'),
  require('../../../assets/maps/world/map_221.jpg'),
  require('../../../assets/maps/world/map_222.jpg'),
  require('../../../assets/maps/world/map_223.jpg'),
  require('../../../assets/maps/world/map_224.jpg'),
  require('../../../assets/maps/world/map_225.jpg'),
  require('../../../assets/maps/world/map_226.jpg'),
  require('../../../assets/maps/world/map_227.jpg'),
  require('../../../assets/maps/world/map_228.jpg'),
  require('../../../assets/maps/world/map_229.jpg'),
  require('../../../assets/maps/world/map_230.jpg'),
  require('../../../assets/maps/world/map_231.jpg'),
  require('../../../assets/maps/world/map_232.jpg'),
  require('../../../assets/maps/world/map_233.jpg'),
  require('../../../assets/maps/world/map_234.jpg'),
  require('../../../assets/maps/world/map_235.jpg'),
  require('../../../assets/maps/world/map_236.jpg'),
  require('../../../assets/maps/world/map_237.jpg'),
  require('../../../assets/maps/world/map_238.jpg'),
  require('../../../assets/maps/world/map_239.jpg'),
  require('../../../assets/maps/world/map_240.jpg'),
  require('../../../assets/maps/world/map_241.jpg'),
  require('../../../assets/maps/world/map_242.jpg'),
  require('../../../assets/maps/world/map_243.jpg'),
  require('../../../assets/maps/world/map_244.jpg'),
  require('../../../assets/maps/world/map_245.jpg'),
  require('../../../assets/maps/world/map_246.jpg'),
  require('../../../assets/maps/world/map_247.jpg'),
  require('../../../assets/maps/world/map_248.jpg'),
  require('../../../assets/maps/world/map_249.jpg'),
  require('../../../assets/maps/world/map_250.jpg'),
  require('../../../assets/maps/world/map_251.jpg'),
  require('../../../assets/maps/world/map_252.jpg'),
  require('../../../assets/maps/world/map_253.jpg'),
  require('../../../assets/maps/world/map_254.jpg'),
  require('../../../assets/maps/world/map_255.jpg'),
  require('../../../assets/maps/world/map_256.jpg'),
  require('../../../assets/maps/world/map_257.jpg'),
  require('../../../assets/maps/world/map_258.jpg'),
  require('../../../assets/maps/world/map_259.jpg'),
  require('../../../assets/maps/world/map_260.jpg'),
  require('../../../assets/maps/world/map_261.jpg'),
  require('../../../assets/maps/world/map_262.jpg'),
  require('../../../assets/maps/world/map_263.jpg'),
  require('../../../assets/maps/world/map_264.jpg'),
  require('../../../assets/maps/world/map_265.jpg'),
  require('../../../assets/maps/world/map_266.jpg'),
  require('../../../assets/maps/world/map_267.jpg'),
  require('../../../assets/maps/world/map_268.jpg'),
  require('../../../assets/maps/world/map_269.jpg'),
  require('../../../assets/maps/world/map_270.jpg'),
  require('../../../assets/maps/world/map_271.jpg'),
  require('../../../assets/maps/world/map_272.jpg'),
  require('../../../assets/maps/world/map_273.jpg'),
  require('../../../assets/maps/world/map_274.jpg'),
  require('../../../assets/maps/world/map_275.jpg'),
  require('../../../assets/maps/world/map_276.jpg'),
  require('../../../assets/maps/world/map_277.jpg'),
  require('../../../assets/maps/world/map_278.jpg'),
  require('../../../assets/maps/world/map_279.jpg'),
  require('../../../assets/maps/world/map_280.jpg'),
  require('../../../assets/maps/world/map_281.jpg'),
  require('../../../assets/maps/world/map_282.jpg'),
  require('../../../assets/maps/world/map_283.jpg'),
  require('../../../assets/maps/world/map_284.jpg'),
  require('../../../assets/maps/world/map_285.jpg'),
  require('../../../assets/maps/world/map_286.jpg'),
  require('../../../assets/maps/world/map_287.jpg'),
  require('../../../assets/maps/world/map_288.jpg'),
  require('../../../assets/maps/world/map_289.jpg'),
  require('../../../assets/maps/world/map_290.jpg'),
  require('../../../assets/maps/world/map_291.jpg'),
  require('../../../assets/maps/world/map_292.jpg'),
  require('../../../assets/maps/world/map_293.jpg'),
  require('../../../assets/maps/world/map_294.jpg'),
  require('../../../assets/maps/world/map_295.jpg'),
  require('../../../assets/maps/world/map_296.jpg'),
  require('../../../assets/maps/world/map_297.jpg'),
  require('../../../assets/maps/world/map_298.jpg'),
  require('../../../assets/maps/world/map_299.jpg'),
  require('../../../assets/maps/world/map_300.jpg'),
  require('../../../assets/maps/world/map_301.jpg'),
  require('../../../assets/maps/world/map_302.jpg'),
  require('../../../assets/maps/world/map_303.jpg'),
  require('../../../assets/maps/world/map_304.jpg'),
  require('../../../assets/maps/world/map_305.jpg'),
  require('../../../assets/maps/world/map_306.jpg'),
  require('../../../assets/maps/world/map_307.jpg'),
  require('../../../assets/maps/world/map_308.jpg'),
  require('../../../assets/maps/world/map_309.jpg'),
  require('../../../assets/maps/world/map_310.jpg'),
  require('../../../assets/maps/world/map_311.jpg'),
  require('../../../assets/maps/world/map_312.jpg'),
  require('../../../assets/maps/world/map_313.jpg'),
  require('../../../assets/maps/world/map_314.jpg'),
  require('../../../assets/maps/world/map_315.jpg'),
  require('../../../assets/maps/world/map_316.jpg'),
  require('../../../assets/maps/world/map_317.jpg'),
  require('../../../assets/maps/world/map_318.jpg'),
  require('../../../assets/maps/world/map_319.jpg'),
  require('../../../assets/maps/world/map_320.jpg'),
  require('../../../assets/maps/world/map_321.jpg'),
  require('../../../assets/maps/world/map_322.jpg'),
  require('../../../assets/maps/world/map_323.jpg'),
  require('../../../assets/maps/world/map_324.jpg'),
  require('../../../assets/maps/world/map_325.jpg'),
  require('../../../assets/maps/world/map_326.jpg'),
  require('../../../assets/maps/world/map_327.jpg'),
  require('../../../assets/maps/world/map_328.jpg'),
  require('../../../assets/maps/world/map_329.jpg'),
  require('../../../assets/maps/world/map_330.jpg'),
  require('../../../assets/maps/world/map_331.jpg'),
  require('../../../assets/maps/world/map_332.jpg'),
  require('../../../assets/maps/world/map_333.jpg'),
  require('../../../assets/maps/world/map_334.jpg'),
  require('../../../assets/maps/world/map_335.jpg'),
  require('../../../assets/maps/world/map_336.jpg'),
  require('../../../assets/maps/world/map_337.jpg'),
  require('../../../assets/maps/world/map_338.jpg'),
  require('../../../assets/maps/world/map_339.jpg'),
  require('../../../assets/maps/world/map_340.jpg'),
  require('../../../assets/maps/world/map_341.jpg'),
  require('../../../assets/maps/world/map_342.jpg'),
  require('../../../assets/maps/world/map_343.jpg'),
  require('../../../assets/maps/world/map_344.jpg'),
  require('../../../assets/maps/world/map_345.jpg'),
  require('../../../assets/maps/world/map_346.jpg'),
  require('../../../assets/maps/world/map_347.jpg'),
  require('../../../assets/maps/world/map_348.jpg'),
  require('../../../assets/maps/world/map_349.jpg'),
  require('../../../assets/maps/world/map_350.jpg'),
  require('../../../assets/maps/world/map_351.jpg'),
  require('../../../assets/maps/world/map_352.jpg'),
  require('../../../assets/maps/world/map_353.jpg'),
  require('../../../assets/maps/world/map_354.jpg'),
  require('../../../assets/maps/world/map_355.jpg'),
  require('../../../assets/maps/world/map_356.jpg'),
  require('../../../assets/maps/world/map_357.jpg'),
  require('../../../assets/maps/world/map_358.jpg'),
  require('../../../assets/maps/world/map_359.jpg'),
  require('../../../assets/maps/world/map_360.jpg'),
  require('../../../assets/maps/world/map_361.jpg'),
  require('../../../assets/maps/world/map_362.jpg'),
  require('../../../assets/maps/world/map_363.jpg'),
  require('../../../assets/maps/world/map_364.jpg'),
  require('../../../assets/maps/world/map_365.jpg'),
  require('../../../assets/maps/world/map_366.jpg'),
  require('../../../assets/maps/world/map_367.jpg'),
  require('../../../assets/maps/world/map_368.jpg'),
  require('../../../assets/maps/world/map_369.jpg'),
  require('../../../assets/maps/world/map_370.jpg'),
  require('../../../assets/maps/world/map_371.jpg'),
  require('../../../assets/maps/world/map_372.jpg'),
  require('../../../assets/maps/world/map_373.jpg'),
  require('../../../assets/maps/world/map_374.jpg'),
  require('../../../assets/maps/world/map_375.jpg'),
  require('../../../assets/maps/world/map_376.jpg'),
  require('../../../assets/maps/world/map_377.jpg'),
  require('../../../assets/maps/world/map_378.jpg'),
  require('../../../assets/maps/world/map_379.jpg'),
  require('../../../assets/maps/world/map_380.jpg'),
  require('../../../assets/maps/world/map_381.jpg'),
  require('../../../assets/maps/world/map_382.jpg'),
  require('../../../assets/maps/world/map_383.jpg'),
  require('../../../assets/maps/world/map_384.jpg'),
  require('../../../assets/maps/world/map_385.jpg'),
  require('../../../assets/maps/world/map_386.jpg'),
  require('../../../assets/maps/world/map_387.jpg'),
  require('../../../assets/maps/world/map_388.jpg'),
  require('../../../assets/maps/world/map_389.jpg'),
  require('../../../assets/maps/world/map_390.jpg'),
  require('../../../assets/maps/world/map_391.jpg'),
  require('../../../assets/maps/world/map_392.jpg'),
  require('../../../assets/maps/world/map_393.jpg'),
  require('../../../assets/maps/world/map_394.jpg'),
  require('../../../assets/maps/world/map_395.jpg'),
  require('../../../assets/maps/world/map_396.jpg'),
  require('../../../assets/maps/world/map_397.jpg'),
  require('../../../assets/maps/world/map_398.jpg'),
  require('../../../assets/maps/world/map_399.jpg'),
  require('../../../assets/maps/world/map_400.jpg'),  
]

// 瓦片
const Grid = (props) => {
  return (
    <Animated.Image source={MAP_DATA[props.gridId]} style={[{ position: 'absolute', borderWidth: 1, borderColor: '#669900', width: px2pd(600), height: px2pd(600) }, props.style]} />
  );
}

// 根据瓦片ID生成四周的边界集合
const generateGridBound = (gridId) => {
    const rows = Math.floor(gridId / MAP_ROWS);
    const columns = gridId % MAP_COLUMNS;

    const bound = [];
    for (let y = 5; y > -5; y--) {
      const row = rows - y;
      for (let x = -3; x < 3; x++) {
        const column = columns + x;
        const id = (row * MAP_COLUMNS) + column;
        bound.push({ gridId: id, x: ((x != 0) ? -x : 0), y: y });
      }
    }
    return bound;
}

const WorldMap = (props) => {
  // 地图起始点坐标
  const mapInitXY = { 
    x: ((getWindowWidth() / 2) - MAP_GRID_WIDTH / 2), 
    y: ((getWindowHeight() / 2) - MAP_GRID_HEIGHT / 2)
  };

  // 地图位移
  const bigMapPos = React.useRef(new Animated.ValueXY(mapInitXY)).current;

  // 瓦片列表
  const [grids, setGrids] = React.useState([]);

  // 各种状态数  
  const status = React.useRef({ prevX: 0, prevY: 0 }).current;

  // 地图滑动处理器
  const panResponder = React.useRef(PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt, gestureState) => {
      status.prevX = bigMapPos.x._value;
      status.prevY = bigMapPos.y._value;
    },
    onPanResponderMove: (evt, gestureState) => {
      // 单指操作
      if (gestureState.numberActiveTouches === 1) {
        const x = status.prevX + gestureState.dx;
        const y = status.prevY + gestureState.dy;
        bigMapPos.setValue({ x, y });

        const diffX = mapInitXY.x - x; // 距离出生点偏移量X
        const diffY = mapInitXY.y - y; // 距离出生点偏移量Y
        const diffColumns = Math.floor(diffX / MAP_GRID_WIDTH); // 距离出生点偏移列数
        const diffRows = Math.floor(diffY / MAP_GRID_HEIGHT); // 距离出生点偏离行数
        const gridId = (MAP_COLUMNS * ((MAP_ROWS / 2) + (diffRows - 1))) + ((MAP_COLUMNS / 2) + diffColumns); // 中心点瓦片ID

        setGrids((list) => {
          const boundGridIds = generateGridBound(gridId);
          const newGrids = [];

          lo.forEach(boundGridIds, (item) => {
            const found = lo.find(list, (v) => (parseInt(v.key) == item.gridId));
            if (found == undefined) {
              const grid = (<Grid key={item.gridId} gridId={item.gridId} style={[
                { transform: [{ translateX: bigMapPos.x }, { translateY: bigMapPos.y }] },
                { left: ((diffColumns - item.x) * MAP_GRID_WIDTH), top: ((diffRows - item.y) * MAP_GRID_HEIGHT) }
              ]} />);
              newGrids.push(grid);
            } else {
              newGrids.push(found);
            }
          });

          if (newGrids.length <= 0) {
            return list; // 没发生变化，直接返回。
          }

          return [...newGrids];
        });
      }
    },

    onPanResponderRelease: (evt, gestureState) => {
      status.prevX = bigMapPos.x._value;
      status.prevY = bigMapPos.y._value;
    },
  })).current;

  return (
  <View style={[{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }, { borderWidth: 2, borderColor: '#669900' }]} {...panResponder.panHandlers}>
    {/* 瓦片集合 */}
    <View style={{ flex: 1 }}>
      {grids}
    </View>

    {/* 角色 */}
    <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <FastImage source={require('../../../assets/bg/explore_person.png')} style={{ width: px2pd(185), height: px2pd(166) }} />
    </View>

    {/* 大地图关闭按钮 */}
    <View style={{ position: 'absolute', right: px2pd(20), top: 50 }} onTouchStart={() => {
      if (props.onClose != undefined) {
        props.onClose();
      }
    }}>
      <FastImage style={{ width: px2pd(130), height: px2pd(56) }} source={require('../../../assets/button/map_close_button.png')} />
    </View>
  </View>
  );
}

WorldMap.propTypes = {
  // 地图数据
  data: PropTypes.array,
  // 起始中心点
  initialCenterPoint: PropTypes.array,
};

WorldMap.defaultProps = {
  data: [],
  initialCenterPoint: [0, 0],
};

export default WorldMap;