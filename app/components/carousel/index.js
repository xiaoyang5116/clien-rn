import React from 'react';
import PropTypes from 'prop-types';

import { 
    Dimensions, 
    View, 
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
    SafeAreaView,
} from 'react-native';

import {
    Component,
    EventKeys,
    StyleSheet,
    getWindowSize,
    AppDispath,
} from "../../constants";

import Modal from 'react-native-modal';
import Carousel from 'react-native-snap-carousel'
import RootView from '../../components/RootView';
import { TextButton } from '../../constants/custom-ui';
import FastImage from 'react-native-fast-image';
import ImageCapInset from 'react-native-image-capinsets-next';
import { confirm } from '../dialog/ConfirmDialog';

const winSize = getWindowSize();
const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

const previewImages = [
  { worldId: 0, img: require('../../../assets/world/world_0.jpg') },
  { worldId: 1, img: require('../../../assets/world/world_1.jpg') },
  { worldId: 2, img: require('../../../assets/world/world_2.jpg') },
];

const EnterButton = (props) => {
  const [visable, setVisable] = React.useState('none');

  React.useEffect(() => {
    const listener = DeviceEventEmitter.addListener(EventKeys.CAROUSEL_ENTER_SHOW, ({ index, status }) => {
      if ((props.index == index) || (index < 0)) {
        setVisable(status);
      }
    });
    return () => {
      listener.remove();
    };
  }, []);

  return (
    <View style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 60, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: 80, display: visable }}>
        <TextButton title='进入' onPress={() => {
          DeviceEventEmitter.emit(EventKeys.CAROUSEL_SELECT_ITEM, { item: props.item, index: props.index });
        }} />
      </View>
    </View>
  );
}

const WorldPreview = (props) => {
  const { item } = props;
  const [propNum, setPropNum] = React.useState(-1);

  React.useEffect(() => {
    AppDispath({ 
      type: 'PropsModel/getPropNum', 
      payload: { propId: 40 },
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
            <View style={styles2.bodyContainer}>
                <View style={styles2.viewContainer}>
                  <View style={styles2.titleContainer}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{item.title}</Text>
                  </View>
                  <View style={styles2.descContainer}>
                    <FastImage style={{ width: '100%', height: 200, borderBottomWidth: 1, borderColor: '#999' }}
                      resizeMode='cover' source={prevImg}
                    />
                    <Text style={{ fontSize: 14, padding: 6, lineHeight: 20 }}>{(item.desc != undefined ? item.desc : item.body)}</Text>
                  </View>
                  <View style={{ marginTop: 20, height: 100, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
                    <View style={{ width: 200 }}>
                      <TextButton title={'进入'} onPress={() => {
                          confirm(`进入${item.title}消耗道具：木瓜x1`, () => {
                            props.onClose();
                            AppDispath({ type: 'PropsModel/reduce', payload: { propsId: [40], num: 1, mode: 1 } });
                            DeviceEventEmitter.emit(EventKeys.CAROUSEL_SELECT_ITEM, { item: props.item, index: props.index });
                          });
                        }} />
                    </View>
                    <View style={{ width: 200 }}>
                      <TextButton title={'返回'} onPress={() => { props.onClose(); }} />
                    </View>
                  </View>
                  {
                    (!propEnough)
                    ? (
                    <View style={styles2.tipsContainer}>
                      <Text style={{ color: '#ff1112' }}>* 木瓜数量不足，当前数量={propNum}</Text>
                    </View>
                    ) : (<></>)
                  }
                </View>
                <ImageCapInset
                    style={{ width: '100%', height: '100%', position: 'absolute', zIndex: -1 }}
                    source={require('../../../assets/bg/world_preview_border.png')}
                    capInsets={{ top: 20, right: 20, bottom: 20, left: 20 }}
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

const CarouselCardItem = ({ item, index }) => {
  let contentView = null;
  const isWorldSelector = item.imgUrl != undefined;
  if (isWorldSelector) {
    contentView = (
      <View style={styles.cardItem} key={index}>
        <FastImage source={{ uri: item.imgUrl }} style={styles.image} />
        <Text style={styles.header}>{item.title}</Text>
        <Text style={styles.imgBody}>{item.body}</Text>
      </View>
    );
  } else {
    contentView = (
      <View style={styles.cardItem} key={index}>
        <Text style={styles.header}>{item.title}</Text>
        <Text style={styles.textBody}>{item.body}</Text>
        <EnterButton item={item} index={index} />
      </View>
    );
  }
  return (
    <TouchableOpacity activeOpacity={1} onPress={() => { 
        if (isWorldSelector) {
          const key = RootView.add(<WorldPreview item={item} index={index} onClose={() => {
            RootView.remove(key);
          }} />);
        } else {
          DeviceEventEmitter.emit(EventKeys.CAROUSEL_ENTER_SHOW, { index, status: 'flex' });
        }
      }}>
      {contentView}
    </TouchableOpacity>
  );
}

export default class CarouselView extends Component {
  constructor(props) {
    super(props);
    this.refCarousel = React.createRef();
    this.listener = null;
  }

  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener(EventKeys.CAROUSEL_SELECT_ITEM, (params) => {
        if (this.props.onSelect != undefined) {
            this.props.onSelect(params);
            this.props.onClose();
        }
    });
  }

  componentWillUnmount() {
      this.listener.remove();
  }

  onSnapToItem = (index) => {
    DeviceEventEmitter.emit(EventKeys.CAROUSEL_ENTER_SHOW, { index: -1, status: 'none' }); 
  }

  render() {
    return (
      <View style={styles.container}>
        <Carousel
            layout="default"
            layoutCardOffset={0}
            ref={this.refCarousel}
            data={this.props.data}
            renderItem={CarouselCardItem}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            inactiveSlideShift={0}
            useScrollView={false}
            firstItem={this.props.initialIndex}
            onSnapToItem={this.onSnapToItem}
        />
        <View style={styles.bottomBar}>
            <TextButton title='退出' onPress={() => {
                this.props.onClose();
            }} />
        </View>
      </View>
    );
  }
}

CarouselView.prototypes = {
    data: PropTypes.object,
    initialIndex: PropTypes.number,
    onClose: PropTypes.func,
    onSelect: PropTypes.func,
};

CarouselView.defaultProps = {
    initialIndex: 0,
};

export class CarouselUtils {
    static show(props) {
        const key = RootView.add(<CarouselView {...props} onClose={() => {
            RootView.remove(key);
        }} />);
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute', 
        left: 0, top: 0, 
        width: '100%', height: '100%', 
        backgroundColor: 'rgba(0,0,0, 0.7)',
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    },
    bottomBar: {
        position: 'absolute', left: 0, bottom: 0, 
        width: '100%', height: 150, 
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    },
    cardItem: {
      backgroundColor: 'white',
      borderRadius: 8,
      width: ITEM_WIDTH,
      paddingBottom: 40,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
    },
    image: {
      width: ITEM_WIDTH,
      height: 300,
    },
    header: {
      color: "#222",
      fontSize: 28,
      fontWeight: "bold",
      paddingLeft: 20,
      paddingTop: 20
    },
    imgBody: {
      color: "#222",
      fontSize: 18,
      paddingLeft: 20,
      paddingLeft: 20,
      paddingRight: 20
    },
    textBody: {
      height: 300,
      marginTop: 10,
      color: "#222",
      fontSize: 18,
      paddingLeft: 20,
      paddingLeft: 20,
      paddingRight: 20
    },
    enterButton: {
      position: 'absolute', 
      left: 0, 
      bottom: 0, 
      width: '100%', 
      height: 60, 
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center', 
    },
});

const styles2 = StyleSheet.create({
  bodyContainer: {
    width: '94%', 
    height: '100%', 
    overflow: 'hidden',
    backgroundColor: '#fff',
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