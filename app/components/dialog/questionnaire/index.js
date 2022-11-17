import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useState } from 'react';

import * as RootNavigation from '../../../utils/RootNavigation';

import { HalfPanel } from '../../panel';
import { TextButton, BtnIcon } from '../../../constants/custom-ui';
import { DataContext } from '../../../constants';

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

const Problem = ({ viewData, onDialogCancel, actionMethod }) => {
  const dataContext = useContext(DataContext)
  const { sections } = viewData;
  const [problemIndex, setProblemIndex] = useState(0)
  const [selectIndex, setSelectIndex] = useState(-1);
  const currentProblem = sections[problemIndex]

  const nextProblem = () => {
    if (problemIndex < sections.length - 1) {
      actionMethod(currentProblem.btn[selectIndex])
      setProblemIndex(problemIndex + 1)
      setSelectIndex(-1)
    } else {
      actionMethod(currentProblem.btn[selectIndex])
      dataContext.isCover = true
      RootNavigation.navigate('Article');
      onDialogCancel()
    }
  }

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
          title={problemIndex < sections.length - 1 ? "下一题" : "完成作答"}
          onPress={nextProblem}
          disabled={selectIndex === -1 ? true : false}
        />
      </View>
    </View>
  );
};

const Questionnaire = props => {
  const { viewData, onDialogCancel, actionMethod } = props;
  const { title, desc } = viewData;

  const [isBegin, setIsBegin] = useState(false);

  return (
    <HalfPanel>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 20, color: '#000' }}>{title}</Text>
        </View>
        {isBegin ? (
          <Problem
            viewData={viewData}
            onDialogCancel={onDialogCancel}
            actionMethod={actionMethod}
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
