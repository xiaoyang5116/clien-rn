import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import React from 'react';

import Swiper from '../../components/Swiper';
// import Swiper from 'react-native-swiper'


const BookDetailPage = props => {
  const BookId = props.route.params;

  const [swiperIndex, setSwiperIndex] = React.useState(0);

  // console.log('BookDetailPage', BookId);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, position: 'relative', }}>
        <View style={styles.headerContarner}>
          <Text style={styles.footerText} onPress={() => { props.navigation.goBack() }}>返回</Text>
        </View>
        <ScrollView
          style={{ flex: 1, marginBottom: 60 }}
          overScrollMode={"never"}
          showsVerticalScrollIndicator={false}
        >
          <Swiper
            style={{ width: '100%', height: 250 }}
            swiperIndex={swiperIndex}
            onChange={index => { setSwiperIndex(index) }}
          >
            <View style={styles.item1}></View>
            <View style={styles.item2}></View>
            <View style={styles.item3}></View>
          </Swiper>
          <View style={{ paddingLeft: 12, paddingRight: 12 }}>
            <View style={{ height: 200, backgroundColor: "#ccc", marginTop: 20, borderRadius: 12 }}>
              {/* <Text>{BookId.id}</Text> */}
            </View>
            <View style={{ marginBottom: 12, marginTop: 12, height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
              <Text style={{ fontSize: 16 }}>目录</Text>
              <Text style={{ fontSize: 16 }}>连载至400章·20小时前更新{" > "}</Text>
            </View>
          </View>

        </ScrollView>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>听书</Text>
          <Text style={styles.footerText}>加入书架</Text>
          <Text style={styles.startReading} onPress={() => {
            props.navigation.navigate('First')
          }}>
            开始阅读
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BookDetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item1: {
    flex: 1,
    backgroundColor: 'pink',
  },
  item2: {
    flex: 1,
    backgroundColor: 'red',
  },
  item3: {
    flex: 1,
    backgroundColor: 'green',
  },
  headerContarner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 40,
    zIndex: 999,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingLeft: 12,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: "100%",
    height: 60,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 18,
    paddingRight: 18,
  },
  footerText: {
    fontSize: 16,
    color: "#000"
  },
  startReading: {
    fontSize: 16,
    color: "#fff",
    backgroundColor: "red",
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 24,
  },
});
