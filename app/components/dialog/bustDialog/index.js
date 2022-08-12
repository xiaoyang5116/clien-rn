import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  FlatList,
  Image,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import { action, connect, getBustImg, ThemeData } from '../../../constants';
import TextAnimation from '../../textAnimation';


const BustImage = props => {
  const { bustImg, location } = props;

  return (
    <View
      style={[
        styles.bustContainer,
        {
          alignItems: location === 'left' ? 'flex-start' : 'flex-end',
        },
      ]}>
      <Image source={bustImg} />
    </View>
  );
};


// {"confirm": false, "hidden": false, "primaryType": 2, "sectionId": 0,
// "sections": [
//   {"location": "left", "content": [Array], "figureId": 1},
//   {"location": "left", "content": [Array], "figureId": 1},
//   {"location": "left", "content": [Array], "figureId": 1}
// ],
// "style": 10, "textAnimationType": "TextSingle",}

const BustDialog = props => {
  const theme = ThemeData();
  const { viewData, onDialogCancel, actionMethod, specialEffects, figureList } = props;
  const { sections, textAnimationType } = viewData;
  const [sectionsIndex, setSectionsIndex] = useState(0)
  const [contentIndex, setContentIndex] = useState(0);
  const hiddenFiguresId = useRef([])

  useEffect(() => {
    if (figureList.length === 0) {
      props.dispatch(action('FigureModel/getFigureList')());
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
      // 添加隐藏人物的id
      if (
        sections[sectionsIndex + 1].hideId !== undefined &&
        Array.isArray(sections[sectionsIndex + 1].hideId)
      ) {
        hiddenFiguresId.current.push(...sections[sectionsIndex + 1].hideId)
      }

      // 过滤下一个对话人物id
      hiddenFiguresId.current = hiddenFiguresId.current.filter(item => item != sections[sectionsIndex + 1].figureId)

      setSectionsIndex(index => index + 1)
      setContentIndex(0);
      return;
    }

    setContentIndex(contentIndex => contentIndex + 1);
  };



  const _renderItem = ({ item, index }) => {
    if (
      hiddenFiguresId.current.length > 0 &&
      hiddenFiguresId.current.find(i => i === item.figureId) !== undefined
    ) return null

    if (index <= sectionsIndex && figureList.length > 0) {
      const currentFigureData = figureList.find(i => i.id === item.figureId);
      const bustImg = getBustImg(currentFigureData.bust);

      return (
        <View
          style={{
            height: 400,
            width: '100%',
            position: 'absolute',
            zIndex: index,
            opacity: index === sectionsIndex ? 1 : 0.6,
          }}>
          <BustImage bustImg={bustImg} location={item.location} />
          <View style={styles.contentContainer}>
            {
              item.content.map((i, currentIndex) => {
                if (currentIndex === contentIndex) {
                  return (
                    <TextAnimation
                      icon={'▼'}
                      key={currentIndex}
                      fontSize={20}
                      type={textAnimationType}
                      style={theme.dialogFontColor}>
                      {i}
                    </TextAnimation>
                  )
                }
              })
            }
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.viewContainer}>
      <TouchableWithoutFeedback onPress={nextDialog}>
        <View style={styles.container}>
          <FlatList
            style={{
              position: 'absolute',
              width: '95%',
              height: 400,
            }}
            data={sections}
            renderItem={_renderItem}
            extraData={contentIndex}
          />
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
