import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  FlatList,
  Image,
  ImageBackground,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import { action, connect, getBustImg, ThemeData } from '../../../constants';
import TextAnimation from '../../textAnimation';


const BustImage = ({ figureList, figuresArr, currentSections }) => {
  if (figureList.length === 0) return null

  return (
    <View style={styles.bustContainer}>
      {figuresArr.map((item, index) => {
        const { figureId, location, isShow } = item;
        const bustImg = getBustImg(figureList.find(item => item.id === figureId).bust)

        if (isShow == false) return null

        return (
          <View
            key={index}
            style={{
              position: "absolute",
              opacity: currentSections.figureId === figureId ? 1 : 0.6,
              left: location === 'left' ? 0 : null,
              right: location === 'right' ? 0 : null,
            }}>
            <Image source={bustImg} />
          </View>
        )
      })}
    </View>

  )
}

const BustDialog = props => {
  const theme = ThemeData();
  const { viewData, onDialogCancel, actionMethod, specialEffects, figureList } = props;
  const { sections, textAnimationType } = viewData;
  const [sectionsIndex, setSectionsIndex] = useState(0)
  const [contentIndex, setContentIndex] = useState(0);
  const figuresArr = useRef([
    {
      figureId: sections[sectionsIndex].figureId,
      isShow: true,
      location: sections[sectionsIndex].location,
    }
  ])
  const currentSections = sections[sectionsIndex]



  useEffect(() => {
    if (figureList.length === 0) {
      props.dispatch(action('FigureModel/getFigureList')())
    }
  }, []);

  const nextDialog = () => {
    if (
      sectionsIndex === sections.length - 1 &&
      contentIndex >= sections[sectionsIndex].content.length - 1
    ) {
      return onDialogCancel();
    }

    if (
      contentIndex === sections[sectionsIndex].content.length - 1 &&
      sectionsIndex <= sections.length - 1
    ) {
      // 设置人物隐藏
      if (
        sections[sectionsIndex + 1].hideId !== undefined &&
        Array.isArray(sections[sectionsIndex + 1].hideId)
      ) {
        const hideId = sections[sectionsIndex + 1].hideId
        figuresArr.current = figuresArr.current.map(item => hideId.find(h => h === item.figureId) !== undefined ? { ...item, isShow: false } : item)
      }

      // 下一个人物如果保存了，就设置可以显示，如果没有就添加
      const nextFigures = figuresArr.current.find(item => item.figureId === sections[sectionsIndex + 1].figureId)
      if (
        nextFigures !== undefined &&
        nextFigures?.isShow === false
      ) {
        figuresArr.current = figuresArr.current.map(item => item.figureId === sections[sectionsIndex + 1].figureId ? { ...item, isShow: true } : item)
      }
      if (nextFigures === undefined) {
        figuresArr.current.push(
          {
            figureId: sections[sectionsIndex + 1].figureId,
            isShow: true,
            location: sections[sectionsIndex + 1].location,
          }
        )
      }
      setSectionsIndex(index => index + 1)
      setContentIndex(0);
      return;
    }

    setContentIndex(contentIndex => contentIndex + 1);
  };

  return (
    <View style={styles.viewContainer}>
      <TouchableWithoutFeedback onPress={nextDialog}>
        <View style={styles.container}>
          <View style={{ position: 'absolute', height: 400, width: '95%', }}>
            <BustImage
              figureList={figureList}
              figuresArr={figuresArr.current}
              currentSections={currentSections}
            />
            <ImageBackground
              style={{
                height: 150,
                width: '100%',
                borderRadius: 12,
                overflow: "hidden",
              }}
              source={require('../../../../assets/bg/bustDialog_bg.png')}
            >
              <View style={{
                paddingTop: 12,
                paddingBottom: 12,
                paddingLeft: 18,
                paddingRight: 18,
              }}>
                <TextAnimation
                  icon={'▼'}
                  key={`${contentIndex}${sectionsIndex}`}
                  fontSize={20}
                  type={textAnimationType}
                  style={theme.dialogFontColor}
                  children={currentSections.content[contentIndex]}
                />
              </View>
            </ImageBackground>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default connect(state => ({ ...state.FigureModel }))(BustDialog);

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bustContainer: {
    height: 250,
    width: '100%',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    height: 150,
    width: '100%',
    backgroundColor: '#666',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 18,
    paddingRight: 18,
  },
  content: {
    fontSize: 18,
    color: '#000',
  },
});
