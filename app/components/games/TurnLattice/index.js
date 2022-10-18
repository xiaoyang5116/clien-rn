import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import qualityStyle from '../../../themes/qualityStyle';
import { action, connect, getPropIcon } from '../../../constants';
import { px2pd } from '../../../constants/resolution';
import Toast from '../../toast';

import FastImage from 'react-native-fast-image';
import { TextButton } from '../../../constants/custom-ui';

// status: 0-不可翻开 || 1-可翻开 || 2-已翻开
// type: "入口" || "出口" || "道具" || "空" || "墙"

// 不可翻开状态
const Grid_0 = ({ isOpened }) => {
  return (
    <View
      style={[
        styles.gridContainer,
        { backgroundColor: '#0E64FF', opacity: isOpened ? 0.7 : 1 },
      ]}
    />
  );
};

// 可翻开状态
const Grid_1 = ({ item, openGrid }) => {
  return (
    <TouchableHighlight onPress={openGrid}>
      <View
        style={[
          styles.gridContainer,
          { backgroundColor: '#F76363', opacity: 0.7 },
        ]}
      />
    </TouchableHighlight>
  );
};

// 已翻开状态
const Grid_2 = props => {
  return <View style={[styles.gridContainer]} />;
};

// 入口格子
const Grid_Entrance = props => {
  return (
    <View
      style={[styles.gridContainer, { backgroundColor: '#09D0D2', opacity: 0.9 }]}
    />
  );
};

// 出口格子
const Grid_Export = ({ item, openGrid, exportHandler }) => {
  if (item.status === 0) {
    return <Grid_0 isOpened={item.isOpened} />;
  }
  if (item.status === 1) {
    return <Grid_1 openGrid={openGrid} />;
  }
  if (item.status === 2) {
    return (
      <TouchableOpacity onPress={exportHandler}>
        <Grid_2 />
      </TouchableOpacity>
    );
  }
  return <Grid_0 isOpened={item.isOpened} />;
};

// 墙格子
const Grid_Wall = props => {
  return <View style={[styles.gridContainer, { backgroundColor: '#0E64FF' }]} />;
};

// 空格子
const Grid_Empty = ({ item, openGrid }) => {
  if (item.status === 0) {
    return <Grid_0 isOpened={item.isOpened} />;
  }
  if (item.status === 1) {
    return <Grid_1 openGrid={openGrid} />;
  }
  if (item.status === 2) {
    return <Grid_2 />;
  }
  return <Grid_0 />;
};

// 道具格子
const Grid_Prop = ({ item, openGrid, getGridProps }) => {
  const { prop } = item;
  const quality_style = qualityStyle.styles.find(
    e => e.id == parseInt(prop.quality),
  );
  const image = getPropIcon(prop.iconId);

  let status = <></>;
  if (item.status === 0) {
    status = <Grid_0 isOpened={item.isOpened} />;
  }
  if (item.status === 1) {
    status = <Grid_1 openGrid={openGrid} />;
  }

  if (item.status === 2) {
    return (
      <TouchableOpacity onPress={getGridProps}>
        <View
          style={[
            styles.gridContainer,
            { justifyContent: 'center', alignItems: 'center' },
          ]}>
          <FastImage
            style={{
              position: 'absolute',
              width: 40,
              height: 40,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: quality_style.borderColor,
              backgroundColor: quality_style.backgroundColor,
            }}
            source={image.img}
          />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        styles.gridContainer,
        { justifyContent: 'center', alignItems: 'center' },
      ]}>
      <FastImage
        style={{
          position: 'absolute',
          width: 40,
          height: 40,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: quality_style.borderColor,
          backgroundColor: quality_style.backgroundColor,
        }}
        source={image.img}
      />
      {status}
    </View>
  );
};

const TurnLattice = props => {
  const { onClose, turnLatticeData, currentLayer } = props;

  const [gridConfig, setGridConfig] = useState([]);
  const row = turnLatticeData[currentLayer]?.row;

  useEffect(() => {
    props
      .dispatch(action('TurnLatticeModel/getTurnLatticeData')())
      .then(result => {
        if (result !== undefined) {
          setGridConfig([...result]);
        }
      });
  }, []);

  // 翻开格子
  const openGrid = item => {
    props.dispatch(action('TurnLatticeModel/openGrid')({ item })).then(result => {
      if (result !== undefined) {
        setGridConfig([...result]);
      }
    });
  };

  // 领取道具
  const getGridProps = item => {
    props
      .dispatch(action('TurnLatticeModel/getGridProps')({ item }))
      .then(result => {
        if (result !== undefined) {
          setGridConfig([...result]);
        }
      });
  };

  // 出口
  const exportHandler = () => {
    props
      .dispatch(action('TurnLatticeModel/exportGrid')())
      .then(result => {
        if (result !== undefined && result != null) {
          setGridConfig([...result]);
        }else{
          onClose()
        }
      });
  };

  const _renderItem = ({ item, index }) => {
    if (item.type === '入口') return <Grid_Entrance item={item} />;
    if (item.type === '出口') {
      return (
        <Grid_Export
          item={item}
          openGrid={() => {
            openGrid(item);
          }}
          exportHandler={exportHandler}
        />
      );
    }

    if (item.type === '道具') {
      return (
        <Grid_Prop
          item={item}
          openGrid={() => {
            openGrid(item);
          }}
          getGridProps={() => {
            getGridProps(item);
          }}
        />
      );
    }
    if (item.type === '空') {
      return (
        <Grid_Empty
          item={item}
          openGrid={() => {
            openGrid(item);
          }}
        />
      );
    }

    if (item.type === '墙') return <Grid_Wall item={item} />;

    return (
      <Grid_Empty
        item={item}
        openGrid={() => {
          openGrid(item);
        }}
      />
    );
  };

  return (
    <View style={styles.viewContainer}>
      <View style={{ width: 300, height: 300 }}>
        <Image
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            opacity: gridConfig.length === 0 ? 0 : 1,
          }}
          source={require('../../../../assets/bg/baojian.png')}
        />
        {gridConfig.length !== 0 ? (
          <FlatList
            overScrollMode={'never'}
            bounces={false}
            data={gridConfig}
            renderItem={_renderItem}
            numColumns={row}
          />
        ) : (
          <></>
        )}
      </View>
      <TextButton title="退出" onPress={onClose} style={{ marginTop: 20 }} />
    </View>
  );
};

export default connect(state => ({ ...state.TurnLatticeModel }))(TurnLattice);

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 99,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    width: 50,
    height: 50,
    borderColor: '#fff',
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
});
