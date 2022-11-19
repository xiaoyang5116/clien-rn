import { FlatList, StyleSheet, Text, TouchableOpacity, View, DeviceEventEmitter } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import { action } from '../../../constants';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { HalfPanel } from '../../panel';
import { TextButton, BtnIcon } from '../../../constants/custom-ui';

const Cover = ({ desc, onPress }) => {
  return (
    <>
      <View style={styles.descContainer}>
        <Text style={{ fontSize: 18, color: '#000' }}>{desc}</Text>
      </View>
      <View style={{ position: 'absolute', bottom: '20%' }}>
        <TextButton title={'进入调查问卷'} onPress={onPress} />
      </View>
    </>
  );
};

const Problem = (props) => {
  const { viewData, selectIndex, setSelectIndex, currentProblem, problemKey, nextProblem, } = props
  const { sections } = viewData;

  const renderBtn = ({ item, index }) => {
    return (
      <View style={{ marginTop: 12 }}>
        <TextButton title={item.title} onPress={() => { setSelectIndex(index) }} />
        {index == selectIndex ? (
          <BtnIcon
            id={1}
            style={{
              height: '100%',
              justifyContent: 'center',
              marginLeft: 12,
              transform: [{ scale: 0.8 }],
            }}
          />
        ) : null}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, width: "100%", alignItems: 'center', }}>
      <View style={{ marginTop: 60 }}>
        <Text style={{ fontSize: 18, color: '#000', paddingLeft: 12, paddingRight: 12 }}>
          {currentProblem.content}
        </Text>
      </View>
      <View style={{ marginTop: 20, width: '90%' }}>
        <FlatList
          data={currentProblem.btn}
          renderItem={renderBtn}
          extraData={selectIndex}
        />
      </View>
      <View style={{ position: "absolute", bottom: "20%" }}>
        <TextButton
          title={problemKey < sections.length ? "下一题" : "完成作答"}
          onPress={nextProblem}
          disabled={selectIndex === -1 ? true : false}
        />
      </View>
    </View>
  );
};

const Questionnaire = props => {
  const { viewData, onDialogCancel, actionMethod } = props;
  const { title, desc, sections } = viewData;
  const [isBegin, setIsBegin] = useState(false);  // 是否开始答题
  const [problemKey, setProblemKey] = useState(1)  // 问题索引
  const [selectIndex, setSelectIndex] = useState(-1);  // 选中的答案索引
  const currentProblem = sections[problemKey - 1]  // 当前的问题

  useEffect(() => {
    props.dispatch(action('QuestionnaireModel/getQuestionnaireData')()).then(result => {
      if (result !== null) {
        setIsBegin(true)
        setProblemKey(result.problemKey)
      }
    })
  }, [])

  const nextProblem = () => {
    if (problemKey < sections.length) {
      actionMethod(currentProblem.btn[selectIndex])
      props.dispatch(action('QuestionnaireModel/saveQuestionnaireData')({ isFinish: false, problemKey: currentProblem.btn[selectIndex].toKey }))
      setProblemKey(currentProblem.btn[selectIndex].toKey)
      setSelectIndex(-1)
    } else {
      DeviceEventEmitter.emit("QuestionnaireStatus", true)
      actionMethod(currentProblem.btn[selectIndex])
      props.dispatch(action('QuestionnaireModel/saveQuestionnaireData')({ isFinish: true, problemKey: "end" }))
      onDialogCancel()
    }
  }

  return (
    <HalfPanel>
      <View style={styles.contentContainer}>
        <View style={{ position: "absolute", right: 12, top: 12 }}>
          <TouchableOpacity onPress={onDialogCancel}>
            <AntDesign name={'close'} color={"#000"} size={25} />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 20, color: '#000' }}>{title}</Text>
        </View>
        {isBegin ? (
          <Problem
            {...props}
            selectIndex={selectIndex}
            setSelectIndex={setSelectIndex}
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
    </HalfPanel>
  );
};

export default Questionnaire;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  descContainer: {
    width: '80%',
    height: 200,
    borderColor: '#000',
    borderWidth: 1,
    marginTop: 20,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
