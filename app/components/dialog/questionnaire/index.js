import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  DeviceEventEmitter,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import { action } from '../../../constants';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { HalfPanel } from '../../panel';
import { TextButton, BtnIcon, ImageButton } from '../../../constants/custom-ui';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../../constants/resolution';

const TextImageBtn = props => {
  const { title, onPress, disabled = false } = props;
  const [pressing, setPressing] = useState(false);

  useEffect(() => {
    setPressing(false);
  }, []);

  const onPressIn = () => {
    setPressing(true);
  };
  const onPressOut = () => {
    setPressing(false);
  };

  const Img = ({ source, children }) => {
    return (
      <View
        style={{
          width: px2pd(701),
          height: px2pd(259),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <FastImage
          style={{
            width: px2pd(701),
            height: px2pd(259),
            position: 'absolute',
          }}
          source={source}
        />
        {children}
      </View>
    );
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={1}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}>
      {pressing ? (
        <Img source={require('../../../../assets/questionnaire/btn_bg_2.png')}>
          <Text style={{ fontSize: 20, color: '#000' }}>{title}</Text>
        </Img>
      ) : (
        <Img source={require('../../../../assets/questionnaire/btn_bg_1.png')}>
          <Text style={{ fontSize: 20, color: '#fff' }}>{title}</Text>
        </Img>
      )}
    </TouchableOpacity>
  );
};

const Cover = ({ desc, onPress }) => {
  return (
    <View style={{ flex: 1, marginTop: '20%', alignItems: 'center' }}>
      <ImageBackground
        style={styles.descContainer}
        source={require('../../../../assets/questionnaire/block_bg_1.png')}>
        <Text style={{ fontSize: 20, color: '#000' }}>{desc}</Text>
      </ImageBackground>
      <View style={{ position: 'absolute', bottom: '20%' }}>
        <TextImageBtn onPress={onPress} title={'进入调查问卷'} />
      </View>
    </View>
  );
};

const Problem = props => {
  const { viewData, currentProblem, problemKey, nextProblem } = props;
  const { sections } = viewData;
  const [selectIndex, setSelectIndex] = useState(-1); // 选中的答案索引

  const renderBtn = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectIndex(index);
        }}>
        <ImageBackground
          style={{
            marginTop: 8,
            width: px2pd(913),
            height: px2pd(140),
            justifyContent: 'center',
            alignItems: 'center',
          }}
          source={require('../../../../assets/questionnaire/btn_bg_3.png')}>
          <Text style={{ fontSize: 14, color: '#000' }}>{item.title}</Text>
          {index == selectIndex ? (
            <BtnIcon
              id={14}
              style={{
                height: '100%',
                justifyContent: 'center',
                marginLeft: 12,
              }}
            />
          ) : (
            <BtnIcon
              id={13}
              style={{
                height: '100%',
                justifyContent: 'center',
                marginLeft: 12,
              }}
            />
          )}
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, width: '100%', alignItems: 'center', }}>
      <View style={styles.titleContainer}>
        <FastImage
          style={{ width: px2pd(415), height: px2pd(86) }}
          source={require('../../../../assets/questionnaire/title.png')}
        />
      </View>
      <ImageBackground
        style={{
          width: px2pd(945),
          height: px2pd(532),
          marginTop: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        source={require('../../../../assets/questionnaire/block_bg_2.png')}>
        <Text
          style={{
            fontSize: 20,
            color: '#000',
            paddingLeft: 30,
            paddingRight: 30,
          }}>
          {currentProblem.content}
        </Text>
      </ImageBackground>
      <View style={{ flex: 1, marginTop: 10, width: '100%', alignItems: 'center', }}>
        <FlatList
          data={currentProblem.btn}
          renderItem={renderBtn}
          extraData={selectIndex}
          ListFooterComponent={
            <View style={{ alignItems: 'center' }}>
              <TextImageBtn
                title={problemKey < sections.length ? '下一题' : '完成作答'}
                onPress={() => {
                  nextProblem(selectIndex);
                  setSelectIndex(-1);
                }}
                disabled={selectIndex === -1 ? true : false}
              />
            </View>
          }
        />
      </View>

    </View>
  );
};

const Questionnaire = props => {
  const { viewData, onDialogCancel, actionMethod } = props;
  const { title, desc, sections } = viewData;
  const [isBegin, setIsBegin] = useState(false); // 是否开始答题
  const [problemKey, setProblemKey] = useState(1); // 问题索引
  const currentProblem = sections[problemKey - 1]; // 当前的问题

  useEffect(() => {
    props
      .dispatch(action('QuestionnaireModel/getQuestionnaireData')())
      .then(result => {
        if (result !== null) {
          setIsBegin(true);
          setProblemKey(result.problemKey);
        }
      });
  }, []);

  const nextProblem = selectIndex => {
    if (problemKey < sections.length) {
      // actionMethod(currentProblem.btn[selectIndex]);
      props.dispatch(
        action('QuestionnaireModel/getAward')({
          isFinish: false,
          ...currentProblem.btn[selectIndex]
        }),
      );
      setProblemKey(currentProblem.btn[selectIndex].toKey);
    } else {
      DeviceEventEmitter.emit('QuestionnaireStatus', true);
      // actionMethod(currentProblem.btn[selectIndex]);
      props.dispatch(
        action('QuestionnaireModel/getAward')({
          isFinish: true,
          ...currentProblem.btn[selectIndex],
        }),
      );
      onDialogCancel();
    }
  };

  return (
    <View style={styles.viewContainer}>
      <FastImage
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        source={require('../../../../assets/questionnaire/questionnaire_bg.png')}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.contentContainer}>
          <View style={{ position: 'absolute', right: 12, top: 12, zIndex: 2 }}>
            <ImageButton
              width={px2pd(142)}
              height={px2pd(142)}
              source={require('../../../../assets/questionnaire/close_clicked.png')}
              selectedSource={require('../../../../assets/questionnaire/close_notClicked.png')}
              onPress={onDialogCancel}
            />
          </View>
          {isBegin ? (
            <Problem
              {...props}
              nextProblem={nextProblem}
              currentProblem={currentProblem}
              problemKey={problemKey}
            />
          ) : (
            <Cover
              desc={desc}
              onPress={() => {
                setIsBegin(true);
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Questionnaire;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    zIndex: 99,
  },
  contentContainer: {
    flex: 1,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  descContainer: {
    width: px2pd(962),
    height: px2pd(614),
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
