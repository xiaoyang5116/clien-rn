import React, { useEffect } from 'react'

import Toast from '../../toast'

const ToastTemplate = (props) => {
  let timer = null
  useEffect(() => {
    return () => {
      clearTimeout(timer)
    }
  }, [])
  if (props.currentShow) {
    timer = setTimeout(() => {
      Toast.show(props.content, props.toastType, props.time)
    }, 100);
  }
  return null
}

export default ToastTemplate;