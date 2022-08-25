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

import { px2pd } from '../../constants/resolution';
import { action, connect } from '../../constants';
import RootView from '../RootView';
import { h_m_s_Format } from '../../utils/DateTimeUtils'

import ImageCapInset from 'react-native-image-capinsets-next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import AuxiliaryMaterialsPop from './AuxiliaryMaterialsPop'


// 原材料
const StuffsComponent = (props) => {
  const { stuffsDetail } = props

  const renderStuffs = ({ item, index }) => {
    const { name, currNum, reqNum } = item
    return (
      <View style={{ height: 50, borderWidth: 1, borderColor: "#000", borderRadius: 3, marginTop: 12, backgroundColor: "rgba(255,255,255,0.5)" }}>
        <ImageCapInset
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          source={require('../../../assets/button/40dpi_gray.png')}
          capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
        />
        <View style={{ flex: 1, flexDirection: "row", paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12, alignItems: 'center' }}>
          <Text style={{ flex: 1, fontSize: 16, color: "#000", }}>
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
    )
  }
  return (
    <View>
      <Text style={[styles.title_box, { width: 120, marginTop: 12 }]}>原材料数</Text>
      <FlatList
        data={stuffsDetail}
        renderItem={renderStuffs}
        keyExtractor={(item, index) => item + index}
      />
    </View>
  )
}

// 目标道具
const TargetsComponent = (props) => {
  const { targets, time } = props

  const renderTargets = ({ item }) => {
    const { name, productNum } = item
    return (
      <View style={{ height: 50, borderWidth: 1, borderColor: "#000", borderRadius: 3, marginTop: 12, backgroundColor: "rgba(255,255,255,0.5)" }}>
        <ImageCapInset
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          source={require('../../../assets/button/40dpi_gray.png')}
          capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
        />
        <View style={{ flex: 1, flexDirection: "row", paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12, alignItems: 'center' }}>
          <Text style={{ flex: 1, fontSize: 16, color: "#000", }}>
            {name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: "#000", }}>
              {productNum}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View>
      <View style={styles.expected_container}>
        <Text style={styles.title_box}>预计耗时: {h_m_s_Format(time)}</Text>
        <Text style={[styles.title_box, { marginLeft: 24 }]}>有概率获得</Text>
      </View>
      <View>
        <FlatList
          data={targets}
          renderItem={renderTargets}
          keyExtractor={(item, index) => item + index}
        />
      </View>
    </View>
  )
}

// 辅助材料
const AuxiliaryMaterials = (props) => {
  const { propsDetail, auxiliaryMaterials, setAuxiliaryMaterials } = props

  const openAuxiliaryMaterialsPop = () => {
    const key = RootView.add(
      <AuxiliaryMaterialsPop
        propsDetail={propsDetail}
        setAuxiliaryMaterials={setAuxiliaryMaterials}
        onClose={() => {
          RootView.remove(key);
        }} />
    )
  }

  const AddAuxiliaryMaterialsComponent = () => {
    if (auxiliaryMaterials.length === 0) {
      return (
        <TouchableOpacity style={{ marginTop: 12, }} onPress={openAuxiliaryMaterialsPop}>
          <View style={{ height: 50, borderWidth: 1, borderColor: "#000", borderRadius: 3, backgroundColor: "rgba(255,255,255,0.5)" }}>
            <ImageCapInset
              style={{ width: '100%', height: '100%', position: 'absolute' }}
              source={require('../../../assets/button/40dpi_gray.png')}
              capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
            />
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <AntDesign name='pluscircleo' color={"#000"} size={23} />
            </View>
          </View>
        </TouchableOpacity>
      )
    } else {
      const { name, currNum, reqNum } = auxiliaryMaterials[0]
      return (
        <TouchableOpacity style={{ marginTop: 12, }} onPress={openAuxiliaryMaterialsPop}>
          <View style={{ height: 50, borderWidth: 1, borderColor: "#000", borderRadius: 3, backgroundColor: "rgba(255,255,255,0.5)" }}>
            <ImageCapInset
              style={{ width: '100%', height: '100%', position: 'absolute' }}
              source={require('../../../assets/button/40dpi_gray.png')}
              capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
            />
            <View style={{ flex: 1, flexDirection: "row", paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12, alignItems: 'center' }}>
              <Text style={{ flex: 1, fontSize: 16, color: "#000", }}>
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
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', marginTop: 12, justifyContent: "flex-start", alignItems: "center" }}>
        <Text style={[styles.title_box, { width: 120, }]}>辅助材料</Text>
      </View>
      <View>
        <AddAuxiliaryMaterialsComponent />
      </View>
    </View>

  )
}

const DanFangDetailPage = (props) => {
  const { danFang } = props
  const [danFangDetail, setDanFangDetail] = useState({})

  // 辅助材料
  const [auxiliaryMaterials, setAuxiliaryMaterials] = useState([])

  useEffect(() => {
    props.dispatch(action('AlchemyModel/getDanFangDetail')(danFang)).then((result) => {
      setDanFangDetail(result)
    })
  }, [])

  const Header = () => {
    return (
      <View style={{ justifyContent: 'center', marginTop: 12 }}>
        <View style={{ position: 'absolute', zIndex: 2 }}>
          <TouchableOpacity onPress={props.onClose}>
            <AntDesign name='left' color={"#fff"} size={23} style={{ marginLeft: 12, }} />
          </TouchableOpacity>
        </View>
        <Text style={{ textAlign: 'center', fontSize: 24, color: '#fff' }}>
          材料选择
        </Text>
      </View>
    )
  }

  const DanFangDetail = () => {
    return (
      <View style={{ flex: 1, paddingLeft: 12, paddingRight: 12, marginTop: 12 }}>
        <StuffsComponent stuffsDetail={danFangDetail.stuffsDetail} />
        <TargetsComponent targets={danFangDetail.targets} time={danFang.time} />
        <AuxiliaryMaterials propsDetail={danFangDetail.propsDetail} auxiliaryMaterials={auxiliaryMaterials} setAuxiliaryMaterials={setAuxiliaryMaterials} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <FastImage
        style={{ position: 'absolute', width: px2pd(1080), height: px2pd(2400) }}
        source={require('../../../assets/plant/plantBg.jpg')}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <Header />
        <DanFangDetail />
      </SafeAreaView>
    </View>
  )
}

export default connect(state => ({ ...state.AlchemyModel }))(DanFangDetailPage)

const styles = StyleSheet.create({
  title_box: {
    height: 40,
    lineHeight: 40,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: "#389e0d",
    fontSize: 16,
    color: "#1f1f1f",
    textAlign: 'center',
  },
  expected_container: {
    flexDirection: "row",
    marginTop: 12,
  }
})