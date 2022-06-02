import React from 'react';

import { 
    View, 
    Text,
    DeviceEventEmitter,
    SafeAreaView,
} from 'react-native';

import {
    EventKeys,
    getWindowSize,
    AppDispath,
    StyleSheet,
} from "../../constants";

import Modal from 'react-native-modal';
import ImageCapInset from 'react-native-image-capinsets-next';
import Toast from '../../components/toast';
import TransAnimation from './TransAnimation';
import FastImage from 'react-native-fast-image';
import RootView from '../RootView';
import { confirm } from '../dialog/ConfirmDialog';
import { TextButton } from '../../constants/custom-ui';

const winSize = getWindowSize();
const PROP_ID = 44; // 时空宝玉

const previewImages = [
    { worldId: 0, img: require('../../../assets/world/world_0.jpg') },
    { worldId: 1, img: require('../../../assets/world/world_1.jpg') },
    { worldId: 2, img: require('../../../assets/world/world_2.jpg') },
];

const WorldPreview = (props) => {
    const { item } = props;
    const [propNum, setPropNum] = React.useState(-1);
  
    React.useEffect(() => {
      AppDispath({ 
        type: 'PropsModel/getPropNum', 
        payload: { propId: PROP_ID },
        cb: (result) => {
          setPropNum(result);
        }
      });
    }, []);
  
    if (propNum >= 0) {
      const prevImg = previewImages.find(e => e.worldId == item.worldId).img;
      const propEnough = propNum > 0;
      return (
        <Modal isVisible={true} coverScreen={false} style={{padding: 0, margin: 0, flex: 1, zIndex: 1}} animationIn='fadeIn' animationOut='fadeOut' animationInTiming={2000} backdropColor="#fff" backdropOpacity={1}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.bodyContainer}>
                  <View style={styles.viewContainer}>
                    <View style={styles.titleContainer}>
                      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{item.title}</Text>
                    </View>
                    <View style={styles.descContainer}>
                      <FastImage style={{ width: '100%', height: 200, borderBottomWidth: 1, borderColor: '#999' }}
                        resizeMode='cover' source={prevImg}
                      />
                      <Text style={{ fontSize: 14, padding: 6, lineHeight: 20 }}>{(item.desc != undefined ? item.desc : item.body)}</Text>
                    </View>
                    <View style={{ marginTop: 20, height: 100, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
                      <View style={{ width: 200 }}>
                        <TextButton title={'进入'} onPress={() => {
                            if (!propEnough) {
                              Toast.show('时空宝玉不足！', 'CenterToTop');
                            } else {
                              confirm(`进入${item.title}消耗道具：时空宝玉x1`, () => {
                                props.onClose();
                                AppDispath({ type: 'PropsModel/reduce', payload: { propsId: [PROP_ID], num: 1, mode: 1 } });
                                const key = RootView.add(<TransAnimation onCompleted={() => {
                                  DeviceEventEmitter.emit(EventKeys.CAROUSEL_SELECT_ITEM, { item: props.item, index: props.index });
                                  RootView.remove(key);
                                }} />);
                              });
                            }
                          }} />
                      </View>
                      <View style={{ width: 200 }}>
                        <TextButton title={'返回'} onPress={() => { props.onClose(); }} />
                      </View>
                    </View>
                    {
                      (!propEnough)
                      ? (
                      <View style={styles.tipsContainer}>
                        <Text style={{ color: '#ff1112' }}>* 木瓜数量不足，当前数量={propNum}</Text>
                      </View>
                      ) : (<></>)
                    }
                  </View>
                  <ImageCapInset
                      style={{ width: '100%', height: '100%', position: 'absolute', zIndex: -1 }}
                      source={require('../../../assets/bg/world_preview_border.png')}
                      capInsets={{ top: 15, right: 15, bottom: 15, left: 15 }}
                    />
                  <FastImage style={{ position: 'absolute', left: 0, bottom: -100, zIndex: -1, width: winSize.width, height: 250, opacity: 0.1 }} 
                    resizeMode='cover' 
                    source={require('../../../assets/bg/panel_c.png')} />
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      );
    } else {
      return (<></>);
    }
}

export default WorldPreview;

const styles = StyleSheet.create({
    bodyContainer: {
      width: '94%', 
      height: '100%', 
      // overflow: 'hidden',
      backgroundColor: '#fff',
      // justifyContent: 'center',
      // alignItems: 'center',
    },
    viewContainer: {
      flex: 1, 
      flexDirection: 'column', 
      justifyContent: 'flex-start', 
      alignItems: 'center',
    },
    titleContainer: {
      width: '96%', 
      height: 40, 
      marginTop: 20, 
      borderWidth: 1, 
      borderColor: '#999', 
      backgroundColor: '#efe2d2', 
      justifyContent: 'center', 
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.4,
      shadowRadius: 3,
    }, 
    descContainer: {
      width: '96%', 
      marginTop: 10, 
      borderWidth: 1, 
      borderColor: '#999', 
      backgroundColor: '#eee',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.4,
      shadowRadius: 3,
    },
    tipsContainer: {
      width: '96%', 
      marginTop: 10, 
      borderRadius: 10,
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 10,
      paddingRight: 10,
      borderWidth: 1, 
      borderColor: '#eee', 
      backgroundColor: '#fff',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      // display: 'none',
    },
  });