import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react'

import { action, connect } from '../../constants';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Slider from '@react-native-community/slider';
import ImageCapInset from 'react-native-image-capinsets-next';


// 选择炼丹数量
const SelectQuantityPop = (props) => {

  const { recipeDetail, auxiliaryMaterials, onCloseRecipePage, onCloseRecipeDetailPage } = props
  const newRecipe = { ...recipeDetail, propsDetail: auxiliaryMaterials }

  const [refiningNum, setRefiningNum] = useState(1)
  const maxValue = useRef(1)
  const sliderValue = useRef(1)

  useEffect(() => {
    props.dispatch(action('LianQiModel/getRefiningNum')(newRecipe)).then((result) => {
      sliderValue.current = result
      maxValue.current = result
      setRefiningNum(result)
    })
  }, [])

  const _onValueChange = (value) => {
    const currentValue = parseInt(value)
    if (currentValue === 0) {
      setRefiningNum(1)
    } else {
      setRefiningNum(currentValue)
    }
  }

  const onChangeNum = (num) => {
    if ((num + refiningNum > maxValue.current) || (num + refiningNum < 1)) return
    sliderValue.current = num + refiningNum
    setRefiningNum(num + refiningNum)
  }

  const onConfirm = () => {
    props.dispatch(action('LianQiModel/lianQi')({ recipeData: newRecipe, refiningNum, })).then(() => {
      props.onClose()
      onCloseRecipePage()
      onCloseRecipeDetailPage()
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: 'center', zIndex: 99 }}>
      <View style={{ width: 300, height: 250, backgroundColor: "#484747", borderRadius: 5, borderWidth: 1, borderColor: "#CBCBCB" }}>
        <ImageCapInset
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          source={require('../../../assets/button/40dpi_gray.png')}
          capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
        />
        <View style={{ borderRadius: 5, borderWidth: 1, borderColor: "#CBCBCB", margin: 8, height: 200 }}>
          <View>
            <Text style={{ fontSize: 24, color: "#fff", textAlign: "center", marginTop: 8, }}>炼制数量</Text>
            <TouchableOpacity onPress={props.onClose} style={{ position: "absolute", top: 4, right: 4 }}>
              <AntDesign name='close' color={"#fff"} size={23} />
            </TouchableOpacity>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center", marginTop: 34 }}>
            <Text style={{ color: "#fff", fontSize: 20 }}>{refiningNum}</Text>
            <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <TouchableOpacity onPress={() => { onChangeNum(-1) }}>
                <AntDesign name='caretleft' color={"#fff"} size={30} />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Slider
                  value={sliderValue.current}
                  step={0.1}
                  maximumValue={maxValue.current}
                  minimumValue={0}
                  minimumTrackTintColor="#F7E72D"
                  maximumTrackTintColor={"#000"}
                  onValueChange={_onValueChange}
                />
              </View>
              <TouchableOpacity onPress={() => { onChangeNum(1) }}>
                <AntDesign name='caretright' color={"#fff"} size={30} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ justifyContent: "center", alignItems: 'center', }}>
          <TouchableOpacity onPress={onConfirm}>
            <Text style={{ fontSize: 18, color: "#fff", width: 100, textAlign: "center" }}>确认</Text>
          </TouchableOpacity>
        </View>
      </View >
    </View >
  )
}

export default connect(state => ({ ...state.LianQiModel }))(SelectQuantityPop)