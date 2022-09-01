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

import FastImage from 'react-native-fast-image';
import { TextButton, Header3 } from '../../constants/custom-ui';
import OfferingModal from './OfferingModal';


const DATA = [
  // {id: 1, propId: 20, name: '西瓜', iconId: 1, quality: 1},
  // {id: 2, propId: 21, name: '苹果', iconId: 2, quality: 1},
  // {id: 3, propId: 22, name: '樱桃', iconId: 3, quality: 1},
  // {id: 4, propId: 23, name: '杏', iconId: 4, quality: 1},

  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
];

const Worship = props => {
  const { worshipData } = props;

  const SpaceGrid = ({ item }) => {
    const addOffering = () => {
      props.dispatch(action('WorshipModel/getOfferingProps')()).then(result => {
        if (Array.isArray(result)) {
          const key = RootView.add(
            <OfferingModal
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
      <TouchableOpacity style={styles.gridContainer} onPress={addOffering}>
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

  const PropGrid = ({ item }) => {
    const quality_style = qualityStyle.styles.find(
      e => e.id == parseInt(item.quality),
    );
    const image = getPropIcon(item.iconId);
    return (
      <TouchableOpacity style={styles.gridContainer} onPress={() => { }}>
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
    if (item.propId !== undefined) {
      return <PropGrid item={item} />;
    }

    return <SpaceGrid item={item} />;
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
          <FlatList
            data={worshipData.length > 0 ? worshipData : DATA}
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
