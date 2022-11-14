import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity
} from 'react-native';
import React from 'react';

import Swiper from '../../components/Swiper';
import { px2pd } from '../../constants/resolution';
// import Swiper from 'react-native-swiper'


const BookDetailPage = props => {
  const BookId = props.route.params;

  const [swiperIndex, setSwiperIndex] = React.useState(0);

  // console.log('BookDetailPage', BookId);

  return (
    <View style={{ flex: 1 }}>
      <Image
        style={{ width: "100%", height: "100%", position: 'absolute' }}
        source={require('../../../assets/book/book_detail_bg.png')}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>

          <View style={styles.headerContainer}>
            <View style={{ position: "absolute", width: '100%', height: "100%", backgroundColor: '#f5f5f5', opacity: 0.5, }} />
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: "flex-start", alignItems: 'center', }}>
              <TouchableOpacity
                style={{ marginLeft: 12 }}
                onPress={() => { props.navigation.goBack() }}>
                <Text style={[styles.footerText, { color: '#000', }]}>返回</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* <ScrollView
          style={{ flex: 1, marginBottom: 60 }}
          overScrollMode={"never"}
          showsVerticalScrollIndicator={false}
        > */}
          <Swiper
            style={{ width: '100%', height: 250, marginTop: 50 }}
            swiperIndex={swiperIndex}
            onChange={index => { setSwiperIndex(index) }}
          >
            <View style={styles.item1}>
              <Image style={{ width: "100%", height: "100%" }} source={require('../../../assets/book/1.png')} />
            </View>
            <View style={styles.item1}>
              <Image style={{ width: "100%", height: "100%" }} source={require('../../../assets/book/1.png')} />
            </View>
            <View style={styles.item1}>
              <Image style={{ width: "100%", height: "100%" }} source={require('../../../assets/book/1.png')} />
            </View>
            {/* <View style={styles.item2}>
              <Image style={{ width: "100%", height: "100%" }} source={require('../../../assets/book/3.png')} />
            </View>
            <View style={styles.item3}>
              <Image style={{ width: "100%", height: "100%" }} source={require('../../../assets/book/2.png')} />
            </View> */}
          </Swiper>

          <View style={{ marginTop: 20, justifyContent: "center", alignItems: 'center' }}>
            <Image style={{ width: px2pd(1011), height: px2pd(504) }} source={require('../../../assets/book/5.png')} />
          </View>
          <View style={{ paddingLeft: 12, paddingRight: 12 }}>
            <View style={{ marginBottom: 12, marginTop: 12, height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
              <Text style={{ fontSize: 16 }}>目录</Text>
              <Text style={{ fontSize: 16 }}>连载至400章·20小时前更新{" > "}</Text>
            </View>
          </View>
          {/* </ScrollView> */}

          <ImageBackground
            source={require('../../../assets/book/4.png')}
            style={styles.footerContainer}>
            <Text style={[styles.footerText, { marginLeft: 18 }]}>分享</Text>
            <Text style={[styles.footerText, {}]}>加入书架</Text>
            <View style={{ marginRight: 18 }}>
              <TouchableOpacity onPress={() => {
                props.navigation.navigate('First')
              }}>
                <Image
                  style={{ width: px2pd(318), height: px2pd(109) }}
                  source={require('../../../assets/book/beginBtn.png')} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </SafeAreaView >
    </View >
  );
};

export default BookDetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item1: {
    flex: 1,
  },
  item2: {
    flex: 1,
    backgroundColor: 'red',
  },
  item3: {
    flex: 1,
    backgroundColor: 'green',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 40,
    zIndex: 99,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: "100%",
    height: px2pd(168),
    // backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    color: "#747474"
  },
});
