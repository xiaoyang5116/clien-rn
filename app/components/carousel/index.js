import React from 'react';
import PropTypes from 'prop-types';

import { 
    Dimensions, 
    View, 
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
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

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

const CarouselCardItem = ({ item, index }) => {
  return (
    <TouchableOpacity activeOpacity={1} onPress={() => { DeviceEventEmitter.emit(EventKeys.CAROUSEL_SELECT_ITEM, { item, index }); }}>
        <View style={styles.cardItem} key={index}>
        <FastImage
            source={{ uri: item.imgUrl }}
            style={styles.image}
        />
        <Text style={styles.header}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text>
        </View>
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
        }
    });
  }

  componentWillUnmount() {
      this.listener.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        <Carousel
            layout="default"
            layoutCardOffset={9}
            ref={this.refCarousel}
            data={this.props.data}
            renderItem={CarouselCardItem}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            inactiveSlideShift={0}
            useScrollView={false}
            firstItem={this.props.initialIndex}
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
    body: {
      color: "#222",
      fontSize: 18,
      paddingLeft: 20,
      paddingLeft: 20,
      paddingRight: 20
    }
});