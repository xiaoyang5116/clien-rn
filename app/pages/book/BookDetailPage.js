import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'

const BookDetailPage = (props) => {

  const BookId = props.route.params;
  console.log("BookDetailPage", BookId);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, position: "relative" }}>
        <View style={{ width: "100%", height: 250, backgroundColor: '#ccc', }}></View>
        <View>
          <Text>{BookId.id}</Text>
        </View>
        <View style={{ position: "absolute",bottom:0 }}>
          <Text>开始阅读</Text>
        </View>
      </View>
    </SafeAreaView>

  )
}

export default BookDetailPage