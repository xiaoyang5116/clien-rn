/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  FlatList,
  SectionList,
  useColorScheme,
  View,
  Dimensions,
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

import { 
  NavigationContainer 
} from '@react-navigation/native';

import {
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs';

const PLOT_DATA = [
  {
    title: "难度选择：",
    data: ["简单", "一般", "难"]
  },
  {
    title: "这里是一段很长的对白，很长很长很长很长很长很长很长很长很长很长很长很长。",
    data: ["简单", "一般", "难"]
  }
];

const { width, height, scale, fontScale } = Dimensions.get('window');

const WorldSectionItem = ({ title }) => {
  return (
    <View style={{backgroundColor: "#003964", paddingTop: 2, paddingBottom: 2, marginVertical: 2}}>
      <Button title={title} color="#bcfefe" />
    </View>
  );
};

const TabWorldScreen = ({navigation}) => {
  return (
    <View style={styles.viewContainer}>
      <SectionList
        sections={PLOT_DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <WorldSectionItem title={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <View>
            <Text style={{fontSize: 18, width: width-20, paddingTop: 10, paddingBottom: 10, textAlign:'center', backgroundColor: "#fff"}}>{title}</Text>
          </View>
        )}
      />
    </View>
  );
};

const DetailsScreen = ({navigation}) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>
        Details Screen
      </Text>
      <Button title='Go Home>>>' onPress={()=>navigation.navigate('tabWorld')} />
    </View>
  );
};

const Tab = createBottomTabNavigator();

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="tabWorld" component={TabWorldScreen} options={{
          tabBarLabel: "世界",
          headerTitle: "世界",
        }} />
        <Tab.Screen name="tab2" component={DetailsScreen} options={{
          tabBarLabel: "活动",
          headerTitle: "活动",
        }} />
        <Tab.Screen name="tab3" component={TabWorldScreen} options={{
          tabBarLabel: "技能",
          headerTitle: "技能",
        }} />
        <Tab.Screen name="tab4" component={DetailsScreen} options={{
          tabBarLabel: "商城",
          headerTitle: "商城",
        }} />
        <Tab.Screen name="tab5" component={TabWorldScreen} options={{
          tabBarLabel: "我的",
          headerTitle: "我的",
        }} />
      </Tab.Navigator>
    </NavigationContainer>
  );

  // return (
  //   <SafeAreaView style={backgroundStyle}>
  //     <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
  //     <ScrollView
  //       contentInsetAdjustmentBehavior="automatic"
  //       style={backgroundStyle}>
  //       <Header />
  //       <View
  //         style={{
  //           backgroundColor: isDarkMode ? Colors.black : Colors.white,
  //         }}>
  //         <Section title="Step One">
  //           Edit <Text style={styles.highlight}>App.js</Text> to change this
  //           screen and then come back to see your edits.
  //         </Section>
  //         <Section title="See Your Changes">
  //           <ReloadInstructions />
  //         </Section>
  //         <Section title="Debug">
  //           <DebugInstructions />
  //         </Section>
  //         <Section title="Learn More">
  //           Read the docs to discover what to do next:
  //         </Section>
  //         <LearnMoreLinks />
  //       </View>
  //     </ScrollView>
  //   </SafeAreaView>
  // );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
