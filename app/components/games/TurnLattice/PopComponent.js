import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import React from 'react';

import { getBtnIcon } from '../../../constants';
import { TextButton } from '../../../constants/custom-ui';
import Toast from '../../toast';

const PopComponent = props => {
  const { onClose, title, desc, message, confirm } = props;
  const isLingWu = message.every(item => (item.isOK ? true : false));

  return (
    <View style={styles.viewContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.gongFaNameContainer}>
          <Text style={styles.gongFaName}>{title}</Text>
        </View>
        <View style={styles.gongFaDescContainer}>
          <Text style={styles.gongFaDesc}>{desc}</Text>
        </View>
        <View
          style={{
            paddingLeft: 12,
            paddingRight: 12,
            width: '100%',
            marginTop: 40,
          }}>
          <View
            style={{
              width: '100%',
              backgroundColor: '#E0E0E0',
              alignItems: 'center',
            }}>
            <View style={{ marginTop: 12 }}>
              <Text style={{ fontSize: 18 }}>消耗道具</Text>
            </View>
            <View style={{ marginBottom: 20 }}>
              {message.map((item, index) => {
                const icon = getBtnIcon(item.isOK ? 1 : 6);
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 12,
                    }}>
                    <Image source={icon.img} style={{ width: 30, height: 30 }} />
                    <Text
                      style={{
                        marginLeft: 12,
                        fontSize: 16,
                        color: item.isOK ? '#000' : '#F34D4D',
                      }}>
                      {item.msg}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
          <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: "space-evenly", alignItems: 'center' }}>
            <TextButton
              title={'进入'}
              onPress={() => {
                if (isLingWu) {
                  confirm()
                } else {
                  Toast.show('条件不满足');
                }
              }}
            />
            <TextButton
              title={'退出'}
              onPress={onClose}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default PopComponent;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99
  },
  contentContainer: {
    width: '90%',
    height: '60%',
    backgroundColor: '#ccc',
    alignItems: 'center'
  },
  gongFaNameContainer: {
    width: '100%',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gongFaName: {
    fontSize: 24,
    color: '#000',
  },
  gongFaDescContainer: {
    width: '75%',
  },
  gongFaDesc: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
  },
});
