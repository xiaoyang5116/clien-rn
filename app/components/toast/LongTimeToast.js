import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import { action, connect } from "../../constants"

import AttrToast from './longTimeComponent/AttrToast'
import CluesToast from './longTimeComponent/CluesToast'
import AchievementToast from './longTimeComponent/AchievementToast'
import QuestionnaireToast from './longTimeComponent/QuestionnaireToast'

const LongTimeToast = (props) => {
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
      else {
        clearInterval(timer.current)
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
      if (item.type === "attr") {
        return <AttrToast msg={item} closeToast={closeToast} index={index} />
      }
      if (item.type === "clues") {
        return <CluesToast msg={item} closeToast={closeToast} index={index} />
      }
      if (item.type === "achievement") {
        return <AchievementToast msg={item} closeToast={closeToast} index={index} />
      }
      if (item.type === "questionnaire") {
        return <QuestionnaireToast msg={item} closeToast={closeToast} index={index} />
      }
    }
  }

  return (
    <View style={styles.viewContainer} pointerEvents="none">
      {/* <View style={styles.view_location} pointerEvents="box-none" onTouchStart={()=>{console.log("sssss====");}}> */}
      <FlatList
        data={toastMessages}
        renderItem={_renderMessages}
        keyExtractor={(item, index) => index}
        extraData={msgIndex}
      />
      {/* </View> */}
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
    zIndex: 99
  },
  view_location: {
    // position: "absolute",
    // left: "2%",
    // top: "15%",
  }

})