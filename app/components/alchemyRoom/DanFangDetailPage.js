import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground
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
import { Header3, TextButton } from '../../constants/custom-ui';
import SelectQuantityPop from './SelectQuantityPop';
import Toast from '../toast';
import PropIcon from './components/PropIcon';


export const TitleComponent = ({ title, style, source, }) => {

  const img = source ? source : require('../../../assets/button/lianDan2.png')
  const widthAndHeight = source ? {} : { width: px2pd(500), height: px2pd(108), }
  return (
    <ImageBackground style={{ ...widthAndHeight, justifyContent: 'center', alignItems: 'center', ...style }} source={img} >
      <Text style={styles.title_box}>{title}</Text>
    </ImageBackground>
  )
}

// 原材料
const StuffsComponent = (props) => {
  const { stuffsDetail } = props

  const renderStuffs = ({ item, index }) => {
    const { name, currNum, reqNum } = item
    return (
      <View style={{ height: px2pd(120), borderWidth: 1, borderColor: "#000", borderRadius: 3, marginTop: 12, backgroundColor: "rgba(255,255,255,0.5)" }}>
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
    )
  }
  return (
    <View>
      <TitleComponent title={"原材料数"} style={{ marginTop: 12 }} />
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
      <View style={{ height: px2pd(120), borderWidth: 1, borderColor: "#000", borderRadius: 3, marginTop: 12, backgroundColor: "rgba(255,255,255,0.5)" }}>
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
        <TitleComponent title={"有概率获得"} />
        <TitleComponent
          title={`预计耗时:${h_m_s_Format(time)}`}
          source={require('../../../assets/button/lianDan2.png')}
          style={{ width: px2pd(500), height: px2pd(108), marginLeft:8 }}
        />

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
          <View style={{ height: px2pd(120), borderWidth: 1, borderColor: "#000", borderRadius: 3, backgroundColor: "rgba(255,255,255,0.5)" }}>
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
          <View style={{ height: px2pd(120), borderWidth: 1, borderColor: "#000", borderRadius: 3, backgroundColor: "rgba(255,255,255,0.5)" }}>
            <ImageCapInset
              style={{ width: '100%', height: '100%', position: 'absolute' }}
              source={require('../../../assets/button/40dpi_gray.png')}
              capInsets={{ top: 12, right: 12, bottom: 12, left: 12 }}
            />
            <View style={{ flex: 1, flexDirection: "row", paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12, alignItems: 'center' }}>
              <PropIcon item={auxiliaryMaterials[0]} />
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
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', marginTop: 12, justifyContent: "flex-start", alignItems: "center" }}>
        <TitleComponent title={"辅助材料"} />
      </View>
      <View>
        <AddAuxiliaryMaterialsComponent />
      </View>
    </View>

  )
}

// 丹方详细页面
const DanFangDetailPage = (props) => {
  const { danFang, onCloseDanFangPage } = props
  const [danFangDetail, setDanFangDetail] = useState({})

  // 辅助材料
  const [auxiliaryMaterials, setAuxiliaryMaterials] = useState([])

  useEffect(() => {
    props.dispatch(action('AlchemyModel/getDanFangDetail')(danFang)).then((result) => {
      setDanFangDetail(result)
    })
  }, [])

  const DanFangDetail = () => {
    return (
      <View style={{ flex: 1, paddingLeft: 12, paddingRight: 12, marginTop: 12 }}>
        <StuffsComponent stuffsDetail={danFangDetail.stuffsDetail} />
        <TargetsComponent targets={danFangDetail.targets} time={danFang.time} />
        <AuxiliaryMaterials propsDetail={danFangDetail.propsDetail} auxiliaryMaterials={auxiliaryMaterials} setAuxiliaryMaterials={setAuxiliaryMaterials} />
      </View>
    )
  }

  // 炼丹按钮
  const Alchemy = () => {
    const selectQuantity = () => {
      const key = RootView.add(
        <SelectQuantityPop
          danFangDetail={danFangDetail}
          auxiliaryMaterials={auxiliaryMaterials}
          onCloseDanFangPage={onCloseDanFangPage}
          onCloseDanFangDetailPage={props.onClose}
          onClose={() => {
            RootView.remove(key);
          }} />
      )
    }

    return (
      // <View style={{ justifyContent: "center", alignItems: 'center', marginBottom: 12 }}>
      //   <TextButton title={"炼丹"} onPress={selectQuantity} />
      // </View>
      <View style={{ marginBottom: 12, paddingLeft: 12, paddingRight: 12 }}>
        {danFang.valid ? (
          <TextButton title={'炼丹'} onPress={selectQuantity} />
        ) : (
          <TextButton title={'材料不足,无法炼制'} disabled={true} />
        )}
      </View>
    )
  }

  return (
    <View style={{ flex: 1, zIndex: 99 }}>
      <FastImage
        style={{ position: 'absolute', width: px2pd(1080), height: px2pd(2400) }}
        source={require('../../../assets/plant/plantBg.jpg')}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <Header3
          title={"材料选择"}
          onClose={props.onClose}
          containerStyle={{ marginTop: 12 }}
        />
        <DanFangDetail />
        <Alchemy />
      </SafeAreaView>
    </View>
  )
}

export default connect(state => ({ ...state.AlchemyModel }))(DanFangDetailPage)

const styles = StyleSheet.create({
  title_box: {
    fontSize: 16,
    color: "#1f1f1f",
  },
  expected_container: {
    flexDirection: "row",
    marginTop: 12,
  }
})