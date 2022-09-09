import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import { action, connect } from "../../constants"

import AttributesComponent from './longTimeComponent/LeftToRightSwiper'

const LongTimeToast = (props) => {
  // console.log("props", props);
  const { onClose, toastMessages } = props

  const [msgIndex, setMsgIndex] = useState(0)
  const toastMsgLength = useRef(toastMessages.length)
  const timer = useRef(null)
  const animCount = useRef(0)

  useEffect(() => {
    toastMsgLength.current = toastMessages.length
    timer.current = setInterval(() => {
      if (msgIndex < toastMsgLength.current - 1) {
        setMsgIndex(msgIndex + 1)
      }
    }, 500);
    return () => {
      clearInterval(timer.current)
    }
  }, [msgIndex, toastMessages])

  useEffect(() => {
    return () => {
      clearInterval(timer.current)
    }
  }, [])

  const closeToast = (num) => {
    animCount.current += num
    if (animCount.current === toastMsgLength.current) {
      props.dispatch(action("ToastModel/clearToastMessages")()).then((result) => {
        props.onClose()
      })
    }
  }


  const _renderMessages = ({ item, index }) => {
    if (index <= msgIndex) {
      return <AttributesComponent msg={item} closeToast={closeToast} />
    }
  }
  return (
    <View style={styles.viewContainer} pointerEvents="box-none">
      <View style={styles.view_location}>
        <FlatList
          data={toastMessages}
          renderItem={_renderMessages}
          keyExtractor={(item, index) => index}
          extraData={msgIndex}
        />
      </View>

    </View>
  )
}

export default connect(state => ({ ...state.ToastModel }))(LongTimeToast)

const styles = StyleSheet.create({
  viewContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999
  },
  view_location: {
    position: "absolute",
    left: "2%",
    top: "15%",
  }

})