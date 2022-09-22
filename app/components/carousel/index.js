import React from 'react';
import PropTypes from 'prop-types';

import { 
    Dimensions, 
    View, 
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
    TouchableWithoutFeedback,
} from 'react-native';

import {
    Component,
    EventKeys,
    StyleSheet,
} from "../../constants";

import Carousel from 'react-native-snap-carousel'
import RootView from '../../components/RootView';
import { TextButton } from '../../constants/custom-ui';
import FastImage from 'react-native-fast-image';
import WorldPreview from './WorldPreview';
import DarkBlurView from '../extends/DarkBlurView';
import { px2pd } from '../../constants/resolution';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

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
      <TouchableWithoutFeedback onPress={() => {
        this.props.onClose();
      }}>
        <DarkBlurView>
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
        </DarkBlurView>
      </TouchableWithoutFeedback>
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
        // backgroundColor: 'rgba(0,0,0, 0.7)',
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    },
    bottomBar: {
        position: 'absolute', left: 0, bottom: 0, 
        width: '100%', height: 150, 
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    },
    cardItem: {
      backgroundColor: 'white',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
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
      overflow: 'visible'
    },
    image: {
      width: ITEM_WIDTH,
      height: 300,
    },
    header: {
      color: "#222",
      fontSize: 24,
      fontWeight: "bold",
      paddingLeft: 10,
      paddingRight: 10,
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
      height: px2pd(900),
      marginTop: 10,
      color: "#222",
      fontSize: 16,
      paddingLeft: 12,
      paddingRight: 12,
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
