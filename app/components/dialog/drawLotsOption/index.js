import {FlatList, StyleSheet, Text, View, Image} from 'react-native';
import React, {useState} from 'react';

import {HalfPanel} from '../../panel';
import {TextButton} from '../../../constants/custom-ui';
import {getBtnIcon} from '../../../constants';

const DrawLotsOption = props => {
  const {actionMethod, viewData, onDialogCancel} = props;
  const {title, sections} = viewData;
  const [checkedOption, setCheckedOption] = useState(null);

  const handlerDrawLots = () => {
    if (checkedOption != null) return;
    const result = Math.floor(Math.random() * 100) + 1;
    const checkedItem = sections.find(item => {
      const range = item.rate.split(',');
      if (range[0] === '>') return result > Number(range[1]);
      if (range[0] === '<') return result < Number(range[1]);
      if (range[0] === '>=') return result >= Number(range[1]);
      if (range[0] === '<=') return result <= Number(range[1]);
    });

    setCheckedOption(checkedItem);
    setTimeout(() => {
      actionMethod(checkedItem);
      onDialogCancel();
    }, 2000);
  };

  const _renderOption = ({item, index}) => {
    const icon = getBtnIcon(item.iconId);
    return (
      <View style={styles.optionItem}>
        <Image source={icon.img} style={{width: 30, height: 30}} />
        <Text
          style={{
            fontSize: 16,
            color: item.id === checkedOption?.id ? 'red' : '#000',
            marginLeft: 8,
          }}>
          {item.content}
        </Text>
      </View>
    );
  };

  return (
    <HalfPanel
      backgroundColor={'rgba(0,0,0,0.7)'}
      zIndex={99}
      style={{backgroundColor: '#ccc'}}>
      <View style={{marginTop: 24, width: '100%'}}>
        <Text style={{fontSize: 20, color: '#000', textAlign: 'center'}}>
          - 运势 -
        </Text>
      </View>
      <View style={{marginLeft: 12, marginTop: 12}}>
        <Text style={{fontSize: 16, color: '#000'}}>{title}</Text>
      </View>
      <View style={{marginTop: 20, width: '100%', alignItems: 'center'}}>
        <TextButton title={'选择'} onPress={handlerDrawLots} />
      </View>
      <View style={styles.optionContainer}>
        <FlatList
          data={sections}
          renderItem={_renderOption}
          extraData={checkedOption}
        />
      </View>
    </HalfPanel>
  );
};

export default DrawLotsOption;

const styles = StyleSheet.create({
  optionContainer: {
    width: '100%',
    paddingLeft: 12,
    paddingRight: 12,
    marginTop: 20,
  },
  optionItem: {
    width: '100%',
    height: 35,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#000',
    marginTop: 12,
    paddingLeft: 12,
    flexDirection: 'row',
    // justifyContent: "center",
    alignItems: 'center',
  },
});
