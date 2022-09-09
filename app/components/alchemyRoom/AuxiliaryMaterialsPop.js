import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react'

import Toast from '../toast';

import ImageCapInset from 'react-native-image-capinsets-next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { HalfPanel } from '../panel/HalfPanel'
import { Header3, TextButton } from '../../constants/custom-ui';
import PropIcon from './components/PropIcon';
import { px2pd } from '../../constants/resolution';


const AuxiliaryMaterialsPop = (props) => {

  const { propsDetail, setAuxiliaryMaterials } = props

  const [checkedMaterial, setCheckedMaterial] = useState([])

  const renderItem = ({ item, index }) => {
    const { name, currNum, reqNum, propId } = item
    return (
      <TouchableOpacity onPress={() => { setCheckedMaterial([item]) }}>
        <View style={{ height: px2pd(120), borderWidth: 1, borderColor: checkedMaterial.find(i => i.propId === propId) !== undefined ? "#0BD86A" : '#000', borderRadius: 3, marginTop: 12, backgroundColor: "rgba(255,255,255,0.5)" }}>
          <ImageCapInset
            style={{ width: '100%', height: '100%', position: 'absolute' }}
            source={require('../../../assets/button/40dpi_gray.png')}
            capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
          />
          <View style={{ flex: 1, flexDirection: "row", paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12, alignItems: 'center' }}>
            <PropIcon item={item} />
            <Text style={{ flex: 1, fontSize: 16, color: "#000", marginLeft: 8 }}>
              {name}
            </Text>
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: (currNum < reqNum) ? "#c12c1f" : "#000", }}>
                {currNum}
              </Text>
              <Text style={{ fontSize: 16, color: "#000", }}>
                /{reqNum}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <HalfPanel backgroundColor={"rgba(0,0,0,0.7)"} source={require('../../../assets/plant/plantBg.jpg')} borderRadius={10} zIndex={99}>
      <Header3
        title={"辅助材料选择"}
        onClose={props.onClose}
        containerStyle={{ marginTop: 12 }}
      />
      <View style={{ flex: 1, paddingLeft: 12, paddingRight: 12, }}>
        <FlatList
          data={propsDetail}
          renderItem={renderItem}
          extraData={checkedMaterial}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: "space-evenly", marginBottom: 12 }}>
        <TextButton title={"确定"} onPress={() => {
          if (checkedMaterial.length === 0) return Toast.show("请选择辅助材料")
          setAuxiliaryMaterials(checkedMaterial)
          props.onClose()
        }} />
        <TextButton title={"取消"} onPress={props.onClose} />
      </View>
    </HalfPanel >
  )
}

export default AuxiliaryMaterialsPop

const styles = StyleSheet.create({})