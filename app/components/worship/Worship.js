import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

import { px2pd } from '../../constants/resolution';
import { action, connect, getPropIcon } from '../../constants';
import qualityStyle from '../../themes/qualityStyle';
import RootView from '../RootView';
import { now, timeLeft } from '../../utils/DateTimeUtils';

import FastImage from 'react-native-fast-image';
import { TextButton, Header3 } from '../../constants/custom-ui';
import OfferingModal from './OfferingModal';
import SpeedPage from './SpeedPage';
import SpeedPropPage from './SpeedPropPage';


// icon 数据
const IconData = (item) => {
  const quality_style = qualityStyle.styles.find(
    e => e.id == parseInt(item.quality),
  );
  const image = getPropIcon(item.iconId);
  return { quality_style, image }
}

const LeftTime = (props) => {
  const { currentNeedTime, onFinish } = props
  const [seconds, setSeconds] = React.useState(currentNeedTime);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((sec) => {
        if (sec <= 0) {
          clearInterval(timer);
          setTimeout(() => {
            timeOutHandler();
          }, 0);
          return 0;
        }
        return sec - 1;
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    }
  }, []);

  const timeOutHandler = () => {
    onFinish()
  }

  return (
    <Text>{timeLeft(seconds)}</Text>
  )

}

// 0-空格子, 1-供品, 2-供奉中, 3-宝箱
const Worship = props => {
  const { worshipData } = props;

  // console.log("worshipData", worshipData);

  // 添加贡品
  const addWorshipProp = ({ worshipProp, gridId }) => {
    props.dispatch(action('WorshipModel/addWorshipProp')({ worshipProp, gridId }))
  }

  // 供奉加速
  const worshipSpeedUp = (prop) => {
    props.dispatch(action('WorshipModel/worshipSpeedUp')(prop))
  }

  // 取消供奉
  const cancelWorship = (item) => {
    props.dispatch(action('WorshipModel/cancelWorship')(item))
  }

  // 打开宝箱
  const openTreasureChest = (item) => {
    props.dispatch(action('WorshipModel/openTreasureChest')(item))
  }

  // 改变供奉状态
  const changeWorship = (worshipProp) => {
    props.dispatch(action('WorshipModel/changeWorship')(worshipProp))
  }

  const Title = () => {
    const worshipProp = worshipData.find(item => item.status === 2)
    // console.log("worshipProp", worshipProp);
    if (worshipProp !== undefined) {
      const diffTime = Math.floor((now() - worshipProp.beginTime) / 1000);
      // 当前需要的时间
      const currentNeedTime = worshipProp.needTime - diffTime;
      if (currentNeedTime > 0) {
        return (
          <View style={{ alignItems: "center" }}>
            <Text>{worshipProp.name}</Text>
            <LeftTime currentNeedTime={currentNeedTime} onFinish={() => { changeWorship(worshipProp) }} />
          </View>
        )
      } else {
        changeWorship(worshipProp)
      }
      return (
        <View>
          <Text>{worshipProp.name}</Text>
          <Text>00:00:00</Text>
        </View>
      )
    }
    return <Text>添加供奉</Text>
  }

  const SpaceGrid = ({ item }) => {
    const openOfferingPop = () => {
      props.dispatch(action('WorshipModel/getOfferingProps')()).then(result => {
        if (Array.isArray(result)) {
          const key = RootView.add(
            <OfferingModal
              addWorshipProp={addWorshipProp}
              gridId={item.id}
              data={result}
              onClose={() => {
                RootView.remove(key);
              }}
            />,
          );
        }
      })
    };

    return (
      <TouchableOpacity style={styles.gridContainer} onPress={openOfferingPop}>
        <View
          style={{
            width: px2pd(160),
            height: px2pd(160),
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#000',
          }}
        />
      </TouchableOpacity>
    );
  };

  const OfferingGrid = ({ item }) => {
    const { quality_style, image } = IconData(item)

    return (
      <TouchableOpacity style={styles.gridContainer} onPress={() => { cancelWorship(item) }}>
        <FastImage
          style={{
            width: px2pd(160),
            height: px2pd(160),
            borderRadius: 5,
            borderWidth: 1,
            borderColor: quality_style.borderColor,
            backgroundColor: quality_style.backgroundColor,
          }}
          source={image.img}
        />
      </TouchableOpacity>
    );
  };

  const WorshipInGrid = ({ item }) => {
    const { quality_style, image } = IconData(item)

    const openSpeedPage = () => {
      props.dispatch(action('WorshipModel/getWorshipSpeedUpTime')()).then(result => {
        const key = RootView.add(
          <SpeedPage
            onSpeedUp={worshipSpeedUp}
            data={result}
            prop={item}
            onClose={() => {
              RootView.remove(key);
            }}
          />,
        );
      })
    };

    return (
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity style={styles.gridContainer} onPress={() => { openSpeedPage(item) }}>
          <FastImage
            style={{
              width: px2pd(160),
              height: px2pd(160),
              borderRadius: 5,
              borderWidth: 1,
              borderColor: quality_style.borderColor,
              backgroundColor: quality_style.backgroundColor,
            }}
            source={image.img}
          />
        </TouchableOpacity>
        <Text>供奉中...</Text>
      </View>
    );
  }

  const TreasureChestGrid = ({ item }) => {
    const { quality_style, image } = IconData(item)

    return (
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity style={styles.gridContainer} onPress={() => { openTreasureChest(item) }}>
          <FastImage
            style={{
              width: px2pd(160),
              height: px2pd(160),
              borderRadius: 5,
              borderWidth: 1,
              borderColor: quality_style.borderColor,
              backgroundColor: quality_style.backgroundColor,
            }}
            source={image.img}
          />
        </TouchableOpacity>
        <Text>已完成</Text>
      </View>
    );
  }

  const renderGrid = ({ item }) => {
    if (item.status === 0) {
      return <SpaceGrid item={item} />;
    } else if (item.status === 1) {
      return <OfferingGrid item={item} />;
    } else if (item.status === 2) {
      return <WorshipInGrid item={item} />;
    } else if (item.status === 3) {
      return <TreasureChestGrid item={item} />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SafeAreaView style={{ flex: 1, }}>
        <Header3
          title={'供奉'}
          fontStyle={{ color: '#000' }}
          iconColor={'#000'}
          onClose={props.onClose}
        />
        <View style={{ position: "absolute", top: "30%", width: '100%', alignItems: 'center' }}>
          <Title />
        </View>
        <View style={styles.container}>
          <FlatList
            data={worshipData}
            renderItem={renderGrid}
            horizontal={false}
            numColumns={4}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default connect(state => ({ ...state.WorshipModel }))(Worship);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '65%',
    width: '100%',
    alignItems: 'center',
  },
  gridContainer: {
    marginLeft: 8,
    marginRight: 8,
  },
});
