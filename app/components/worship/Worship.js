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


const Worship = props => {
  const { worshipData } = props;

  const addWorshipProp = ({ worshipProp, gridId }) => {
    props.dispatch(action('WorshipModel/addWorshipProp')({ worshipProp, gridId }))
  }

  const cancelWorship = (item) => {
    props.dispatch(action('WorshipModel/cancelWorship')(item))
  }

  // const LeftTime = () => {
  //   if (worshipData[0].propId !== undefined) {
  //     const diffTime = Math.floor((now() - worshipData[0].beginTime) / 1000);
  //     // 当前需要的时间
  //     const currentNeedTime = worshipData[0].needTime - diffTime;
  //     return (
  //       // <Text>{worshipData[0]}</Text>
  //       <Text>{timeLeft(currentNeedTime)}</Text>
  //     )
  //   }
  // }

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

  const SeedGrid = ({ item }) => {
    const quality_style = qualityStyle.styles.find(
      e => e.id == parseInt(item.quality),
    );
    const image = getPropIcon(item.iconId);

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

  const renderGrid = ({ item }) => {
    if (item.status === 0) {
      return <SpaceGrid item={item} />;
    } else if (item.status === 1) {
      return <SeedGrid item={item} />;
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

        <View style={styles.container}>
          {/* <LeftTime /> */}
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
    bottom: '35%',
    width: '100%',
    alignItems: 'center',
  },
  gridContainer: {
    marginLeft: 8,
    marginRight: 8,
  },
});
