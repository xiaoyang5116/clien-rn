import {
  StyleSheet,
  View,
  Platform
} from 'react-native'
import React, { ReactNode } from 'react'
import PropTypes from 'prop-types';

import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { TextButton } from '../constants/custom-ui';
import { statusBarHeight } from '../constants'


const GuidePage = (props) => {
  return (
    <View style={styles.container}>
      <View style={{ position: 'absolute', top: Platform.OS === "ios" ? statusBarHeight + 8 : 12, right: 12, zIndex: 2 }}>
        <TextButton title={"退出"} onPress={props.onClose} />
      </View>
      <SwiperFlatList index={0} showPagination>
        {props.children}
      </SwiperFlatList>
    </View>
  )
}

export default GuidePage

GuidePage.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
  },
})
