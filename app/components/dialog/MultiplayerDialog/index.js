import React, { useState, useEffect, useRef, createRef } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Image,
  ImageBackground,
} from 'react-native'

import {
  action,
  connect,
  AppDispath,
  ThemeContext,
  changeAvatar
} from "../../../constants";
import lo from 'lodash'

import TextAnimation from '../../textAnimation'
import { TextButton, BtnIcon } from '../../../constants/custom-ui';
import HalfScreen from './HalfScreen';
import FullScreen from './FullScreen';
import { px2pd } from '../../../constants/resolution';


/**
 * 配置设置
Modal.show({ 
    style: 8, title: '神秘阵盘', textAnimationType: 'TextSingle', dialogType: 'FullScreen',
    sections: [
      { 
        key: 'p1',
        dialog: [
          {id: '02',content: ['这里是外来的一般商家来的市场，一般为了图个彩头，不会有多寒酸 我们就在这附近讨乞。不出这条路就行。', '讨乞后每天晚上要给帮派利钱，不然被记住会被帮派打走。', ],},
          {id: '01',content: ['好的',],},
          {id: '04',content: ['好的',],},
        ],
        btn:[{title: '开始乞讨',tokey: "p2"},{title: '退出',tokey: "next"}]
      },
      { 
        key: 'p2',
        dialog: [
          {id:'02',content: ['记住不要去北街，那是富人才能去的地方，乞丐是去不了的。会被打。']}
        ],
        btn: [{title: '退出',tokey: "next"}]
      },
    ]
  })
 */

// 思路：历史对话 => 当前对话 => 点击之后，就当前的对话，push 到历史对话中 => 显示历史对话
const MultiplayerDialog = (props) => {

  const theme = React.useContext(ThemeContext);

  // 样式， 配置数据， 关闭对话框方法
  const { viewData, onDialogCancel, actionMethod, specialEffects, isBubbleColor } = props;
  // 场景ID
  const __sceneId = viewData.__sceneId
  // 文字动画类型
  const textAnimationType = viewData.textAnimationType;
  // 对话框外观类型
  const dialogType = viewData.dialogType;

  // FlatList
  const refFlatList = React.createRef();

  // 历史对话
  const [historyDialogData, setHistoryDialogData] = useState([]);

  // 当前对话数据
  const [currentDialogData, setCurrentDialogData] = useState(viewData.sections[0])
  // 当前对话数据的索引
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0)

  // 当前内容
  const currentData = currentDialogData.dialog[currentDialogIndex]
  // 当前内容的索引
  const [currentContentIndex, setCurrentContentIndex] = useState(0)
  // 当前对话内容的长度
  const currentContentLength = currentData.content.length - 1

  // 所有人物的信息
  const figureInfo = props.figureList

  // 添加历史对话
  const addHistoryDialog = (dialogData) => {
    setHistoryDialogData([...historyDialogData, dialogData])
  }

  useEffect(() => {
    // 获取所有人物信息
    if (props.figureList.length === 0) {
      props.dispatch(action('FigureModel/getFigureList')());
    }

    // 初始化对话
    if (currentData.content.length > 0) {
      const currentDialogContent = currentData.content[0]
      addHistoryDialog({ id: currentData.id, content: currentDialogContent })
    }

    // 初始化 按钮
    if (currentDialogData.btn.length > 0) {
      props.dispatch(action('MaskModel/getOptionBtnStatus')({ optionBtnArr: currentDialogData.btn, __sceneId })).then((result) => {
        if (Array.isArray(result)) {
          setCurrentDialogData({ ...currentDialogData, btn: result })
        }
      })
    }
  }, [])

  // 点击下一段
  const nextParagraph = () => {
    refFlatList.current.scrollToEnd({ animated: true })
    // 判断当前内容是否有下一段
    if (currentContentIndex < currentContentLength) {
      const currentDialogContent = currentData.content[currentContentIndex + 1]
      if (Array.isArray(currentDialogContent)) {
        specialEffects(currentDialogContent)
        setCurrentContentIndex(currentContentIndex + 2)

        // 如果特效是最后一个,则不加入对话记录
        if ((currentContentIndex + 2) <= currentContentLength) {
          addHistoryDialog({ id: currentData.id, content: currentData.content[currentContentIndex + 2] })
        } else if ((currentContentIndex + 2) > currentContentLength && currentDialogIndex < currentDialogData.dialog.length - 1) {
          addHistoryDialog({ id: currentDialogData.dialog[currentDialogIndex + 1].id, content: currentDialogData.dialog[currentDialogIndex + 1].content[0] })
          setCurrentDialogIndex(currentDialogIndex + 1)
          setCurrentContentIndex(0)
        }

      } else {
        addHistoryDialog({ id: currentData.id, content: currentDialogContent })
        setCurrentContentIndex(currentContentIndex + 1)
      }
    }

    // 判断当前对话是否有下一段
    if ((currentContentIndex >= currentContentLength) && currentDialogIndex < currentDialogData.dialog.length - 1) {
      addHistoryDialog({ id: currentDialogData.dialog[currentDialogIndex + 1].id, content: currentDialogData.dialog[currentDialogIndex + 1].content[0] })
      setCurrentDialogIndex(currentDialogIndex + 1)
      setCurrentContentIndex(0)
    }
  }

  //  点击按钮
  const nextDialog = (item) => {
    // 执行动作
    actionMethod(item)

    const newDialogData = viewData.sections.filter(s => s.key === item.tokey)
    if (newDialogData.length > 0) {
      addHistoryDialog({ id: newDialogData[0].dialog[0].id, content: newDialogData[0].dialog[0].content[0] })
      setCurrentDialogIndex(0)
      setCurrentContentIndex(0)
      props.dispatch(action('MaskModel/getOptionBtnStatus')({ optionBtnArr: newDialogData[0].btn, __sceneId })).then((result) => {
        if (Array.isArray(result)) {
          setCurrentDialogData({ ...newDialogData[0], btn: result })
        }
      })
    }
    else {
      onDialogCancel()
    }
  }

  // 渲染对话
  const renderDialog = ({ item }) => {
    // 对话中的提示
    if (item.id === "center") {
      return (
        <TouchableWithoutFeedback onPress={nextParagraph}>
          <View>
            <Text style={styles.tips}>{item.content}</Text>
          </View>
        </TouchableWithoutFeedback>
      )
    }
    // 对话中的旁白
    if (item.id === "left") {
      return (
        <TouchableWithoutFeedback onPress={nextParagraph}>
          <View>
            <Text style={styles.narration}>{item.content}</Text>
          </View>
        </TouchableWithoutFeedback>
      )
    }

    if (figureInfo.length > 0) {
      // 当前说话人的信息
      const figure = figureInfo.find(f => f.id === item.id)

      const bg = (item.id === '01' && viewData.isBubbleColor) ? "#9ec1f3" : "#fff"
      return (
        <TouchableWithoutFeedback onPress={nextParagraph} >
          <View style={{ flexDirection: item.id === '01' ? 'row-reverse' : 'row', justifyContent: 'flex-start', flexWrap: 'nowrap', paddingTop: 18, }}>
            <View>
              <ImageBackground style={{ width: px2pd(144), height: px2pd(145), justifyContent: 'center', alignItems: 'center' }} source={require('../../../../assets/avatar/avatarFrame.png')} >
                <Image source={changeAvatar(figure.avatar)} style={{ width: px2pd(130), height: px2pd(130), borderRadius: 65 }} />
              </ImageBackground>

            </View>
            <View style={item.id === '01' ? styles.paddingRight : styles.paddingLeft}>
              <Text style={{ textAlign: item.id === '01' ? 'right' : 'left' }}>
                {figure.name}
              </Text>
              <View style={{ maxWidth: 270, padding: 8, backgroundColor: bg, borderRadius: 4, position: 'relative' }}>
                {/* 三角形 */}
                <View style={
                  item.id === '01'
                    ? viewData.isBubbleColor
                      ? styles.tipRightTriangleBG
                      : styles.tipRightTriangle
                    : styles.tipLeftTriangle}></View>

                {/* 隐藏的内容 */}
                <Text style={{ fontSize: 18, opacity: 0 }}> {item.content}</Text>
                <View style={{ position: 'absolute', top: 8, left: 8, }}>
                  <TextAnimation
                    fontSize={18}
                    duration={200}
                    style={{ color: item.id === '01' ? "#fff" : "#000" }}
                    opacity={0.8}
                    type={textAnimationType}
                  >
                    {item.content}
                  </TextAnimation>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )
    }

  }

  // 渲染按钮
  const renderBtn = ({ item }) => {
    if ((currentDialogIndex === currentDialogData.dialog.length - 1) && (currentContentIndex >= currentContentLength)) {
      let iconComponent = <></>;
      if (lo.isObject(item.icon) && lo.isBoolean(item.icon.show) && item.icon.show) {
        iconComponent = <BtnIcon id={item.icon.id} style={{ height: "100%", justifyContent: "center" }} />
      }

      return (
        <View style={{ marginTop: 12 }}>
          <TextButton title={item.title} onPress={() => { nextDialog(item) }} />
          {iconComponent}
        </View>
      )
    }
  }

  if (dialogType === "HalfScreen") {
    return (
      <HalfScreen
        onDialogCancel={onDialogCancel}
        viewData={viewData}
        nextParagraph={nextParagraph}
        refFlatList={refFlatList}
        historyDialogData={historyDialogData}
        renderDialog={renderDialog}
        currentDialogData={currentDialogData}
        renderBtn={renderBtn}
      />
    )
  } else if (dialogType === "FullScreen") {
    return (
      <FullScreen
        onDialogCancel={onDialogCancel}
        viewData={viewData}
        nextParagraph={nextParagraph}
        refFlatList={refFlatList}
        historyDialogData={historyDialogData}
        renderDialog={renderDialog}
        currentDialogData={currentDialogData}
        renderBtn={renderBtn}
      />
    )
  }

  return null

}
export default connect((state) => ({ ...state.FigureModel }))(MultiplayerDialog)

const styles = StyleSheet.create({
  fullscreenContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  fullContainer: {
    flex: 1,
    width: '100%',
  },
  halfContainer: {
    width: 360,
    height: 600,
  },
  dialogHeader: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#6a655e',
    borderBottomWidth: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  back: {
    textAlign: 'left',
    flex: 1,
  },
  title: {
    textAlign: 'center',
    flex: 2,
  },
  multifunction: {
    textAlign: 'right',
    flex: 1,
  },
  paddingLeft: {
    paddingLeft: 12,
  },
  paddingRight: {
    paddingRight: 12,
  },
  tipLeftTriangle: {
    position: "absolute",
    left: -7,
    top: 8,
    height: 0,
    width: 0,
    borderTopColor: 'transparent',
    borderTopWidth: 8,
    borderBottomColor: 'transparent',
    borderBottomWidth: 8,
    borderRightColor: '#fff',
    borderRightWidth: 8,
  },
  tipRightTriangle: {
    position: "absolute",
    right: -7,
    top: 8,
    height: 0,
    width: 0,
    borderTopColor: 'transparent',
    borderTopWidth: 8,
    borderBottomColor: 'transparent',
    borderBottomWidth: 8,
    borderLeftColor: '#fff',
    borderLeftWidth: 8,
  },
  tipRightTriangleBG: {
    position: "absolute",
    right: -7,
    top: 8,
    height: 0,
    width: 0,
    borderTopColor: 'transparent',
    borderTopWidth: 8,
    borderBottomColor: 'transparent',
    borderBottomWidth: 8,
    borderLeftColor: '#9ec1f3',
    borderLeftWidth: 8,
  },
  titleFontSize: {
    fontSize: 20,
  },
  tips: {
    fontSize: 16,
    color: "#959595",
    marginTop: 18,
    textAlign: "center",
  },
  narration: {
    fontSize: 18,
    color: "#000",
    marginTop: 18,
    textAlign: "left",
  }
});