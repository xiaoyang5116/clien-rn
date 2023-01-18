import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

import AntDesign from 'react-native-vector-icons/AntDesign';
import Login from './Login'
import Register from './Register'


const LoginPop = (props) => {
  const { onClose } = props
  const [page, setPage] = useState("login")

  let content = <></>
  switch (page) {
    case "login":
      content = <Login setPage={setPage} {...props} />
      break;
    case "register":
      content = <Register setPage={setPage} {...props} />
      break;
    default:
      content = <Login setPage={setPage} {...props} />
      break;
  }

  return (
    <View style={styles.viewContainer}>
      <View style={styles.container}>
        <AntDesign
          onPress={onClose}
          name='close'
          style={{ fontSize: 24, position: 'absolute', right: 8, top: 8, color: "#000", zIndex: 2 }}
        />
        {content}
      </View>
    </View>
  )
}

export default LoginPop

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    height: 400,
    width: 300,
    borderRadius: 12,
    backgroundColor: '#ccc',
    paddingLeft: 12,
    paddingRight: 12,
  },
})