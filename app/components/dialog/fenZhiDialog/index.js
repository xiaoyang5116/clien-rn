import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { action } from '../../../constants';
import { BtnIcon } from '../../button';
import { TextButton } from '../../../constants/custom-ui';


const FenZhiDialog = props => {
  const { onDialogCancel, actionMethod } = props;
  const { __sceneId, sections } = props.viewData;
  const [sectionsData, setSectionsData] = useState(null);

  useEffect(() => {
    for (let index = 0; index < sections.length; index++) {
      const item = sections[index];
      for (let i = 0; i < item.conditions.length; i++) {
        const e = item.conditions[i];
        e.__sceneId = __sceneId
        props.dispatch(action('SceneModel/testCondition')(e)).then(result => {
          e.isUnlock = result
        })
      }
    }
    setSectionsData(sections)
  }, []);

  const _renderFenZhi = ({ item }) => {
    const { title, content, conditions, btn } = item

    const renderBtn = (data) => {
      const { item } = data
      const disabled = conditions.every(e => e.isUnlock === undefined ? false : e.isUnlock)

      return (
        <View>
          <TextButton
            title={item.title}
            disabled={!disabled}
            onPress={() => {
              actionMethod(item)
              onDialogCancel();
            }}
          />
        </View>
      )
    }

    return (
      <View style={{ marginTop: 30 }}>
        <View>
          <Text style={{ fontSize: 18 }}>{title}</Text>
        </View>
        <View>
          <Text style={{ fontSize: 18 }}>{content}</Text>
          {conditions.map((condition, index) => {
            return (
              <View key={index} style={{ height: 30, justifyContent: "center", marginTop: 12 }}>
                {condition.isUnlock === undefined
                  ? <View></View>
                  : <BtnIcon id={condition.isUnlock ? 1 : 6} />
                }
                <Text style={{ marginLeft: 50 }}>{condition.content}</Text>
              </View>
            )
          })}
        </View>
        <View style={{}}>
          <FlatList
            data={btn}
            renderItem={renderBtn}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.viewContainer}>
          <View
            style={{
              width: '50%',
              backgroundColor: '#82B9F8',
              paddingTop: 8,
              paddingBottom: 8,
              marginTop: 20,
            }}>
            <Text style={{ fontSize: 20, color: '#000', textAlign: 'center' }}>
              分支选项
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <FlatList
              data={sectionsData}
              renderItem={_renderFenZhi}
            />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
            <TextButton title={"退出"} onPress={onDialogCancel} />
            <TextButton title={"存档"} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default FenZhiDialog;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
  },
});
