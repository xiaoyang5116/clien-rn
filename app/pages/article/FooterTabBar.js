import React from 'react';
import lo from 'lodash';

import { TouchableWithoutFeedback, View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../../constants';
import FastImage from 'react-native-fast-image';
import { px2pd } from '../../constants/resolution';
import PageUtils from '../../utils/PageUtils';
import * as RootNavigation from '../../utils/RootNavigation';

const TAB_BUTTONS = [
    { title: '人物', action: () => { RootNavigation.navigate('Home', { screen: 'Role' }) } },
    { title: '世界', action: () => { RootNavigation.navigate('Home', { screen: 'World' }) } },
    { title: '探索', action: () => { PageUtils.openExplorePage() } },
    { title: '城镇', action: () => { RootNavigation.navigate('Home', { screen: 'Town' }) } },
    { title: '收藏', action: () => { RootNavigation.navigate('Home', { screen: 'Collection' }) } },
    { title: '道具', action: () => { PageUtils.openPropsPage() } },
];

const FooterTabBar = (props) => {
    const theme = React.useContext(ThemeContext);
  
    const buttons = [];
    let key = 0;
  
    TAB_BUTTONS.forEach(e => {
      const { title, action } = e;
      buttons.push(
        <TouchableWithoutFeedback key={key++} onPress={action}>
          <View style={styles.bottomBannerButton}>
            <FastImage style={[theme.tabBottomImgStyle, { position: 'absolute' }]} source={theme.tabBottomImage} />
            <Text style={[theme.tabBottomLabelStyle, { position: 'absolute', width: 24, fontSize: px2pd(60), color: '#fff' }]}>{title}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    });
  
    return (
      <View style={[styles.bannerStyle, { marginBottom: (Platform.OS == 'ios' ? 20 : 0) }]}>
        {buttons}
      </View>
    );
}

const styles = StyleSheet.create({
    bottomBannerButton: {
        width: 45,
        height: 80,
        marginLeft: 10, 
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
    },

    bannerStyle: {
        flex: 1, 
        flexDirection: 'row', 
        // flexWrap: 'wrap', 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
});

export default FooterTabBar;