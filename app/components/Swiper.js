import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    Animated,
    ViewPropTypes,
    ScrollView
} from 'react-native';
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';

const Button = ({ text, style, onPress }) => {
    return (
        <TouchableHighlight style={style} onPress={onPress}>
            <Text>{text}</Text>
        </TouchableHighlight>
    );
};

export default class Swiper extends PureComponent {
    static propTypes = {
        swiperIndex: PropTypes.number,  // 当前显示的索引
        style: ViewPropTypes.style,  // swiper容器样式
        onChange: PropTypes.func,  // 改变显示索引
        initWidth: PropTypes.number,  // 初始化宽度
        children: PropTypes.node.isRequired,  // 子元素
        autoplayDelay: PropTypes.number,  // 自动播放延迟
        // autoplay: PropTypes.bool,  // 是否自动播放
    };

    static defaultProps = {
        initWidth: 0,
        autoplayDelay: 3000,
    };

    constructor(props) {
        super(props);
        this.state = {
            layoutWidth: props.initWidth,
            autoplayDelay: props.autoplayDelay
        }
        this.scrollViewRef = React.createRef();
        this.interval = null;
    }

    componentDidMount() {
        this._startTimer();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    handleLayout = ({ nativeEvent }) => {
        this.setState({ layoutWidth: nativeEvent.layout.width });
    };

    onAnimationEnd(scrollView) {
        // 计算一页滑动的偏移量
        var offSetX = scrollView.nativeEvent.contentOffset.x;
        // 算出当前为第几页
        var currentPage = Math.floor((offSetX / this.state.layoutWidth));

        this.props.onChange(currentPage);
    }

    _startTimer() {
        var scrollView = this.scrollViewRef.current;
        var count = this.props.children.length;

        this.interval = setInterval(() => {

            //记录当前正在活动的图片
            let activePage = 0;
            if ((this.props.swiperIndex + 1) >= count) {  //防止越界
                activePage = 0;
            } else {
                activePage = this.props.swiperIndex + 1;
            }

            this.props.onChange(activePage);

            //让ScrollView动起来
            var offSetX = activePage * this.state.layoutWidth;
            scrollView.scrollTo({ x: offSetX, y: 0, animated: true });

        }, this.state.autoplayDelay);
    }

    onScrollBeginDrag() {
        clearInterval(this.interval);
    }

    onScrollEndDrag() {
        this._startTimer();
    }

    render() {
        const { style, children } = this.props;
        const { layoutWidth } = this.state;

        const items = children.map((item, index) => {
            return (
                <View
                    style={{ width: layoutWidth }}
                    key={index}
                >
                    {item}
                </View>
            );
        });

        return (
            <View
                style={[style, styles.allContainer]}
                onLayout={this.handleLayout}
            >
                <ScrollView
                    style={[styles.scrollContainer,]}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ref={this.scrollViewRef}
                    pagingEnabled={true}
                    onMomentumScrollEnd={(scrollView) => this.onAnimationEnd(scrollView)}
                    onScrollBeginDrag={this.onScrollBeginDrag.bind(this)}
                    onScrollEndDrag={this.onScrollEndDrag.bind(this)}
                    bounces={false}
                >
                    {items}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    allContainer: {
        position: 'relative',
        overflow: "hidden"
    },
    scrollContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    button: {
        position: 'absolute',
        top: 120,
        width: 50,
        height: 20,
        borderWidth: 1,
        borderColor: '#ccc',
    },
});

