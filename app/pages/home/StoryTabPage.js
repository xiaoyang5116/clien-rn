
import React from 'react';

import {
  connect,
  createAction,
  Component,
  StyleSheet,
} from "../../constants";

import DialogModal from '../../components/DialogModal';
import { Button, Text, View, SectionList } from '../../constants/native-ui';

class StoryTabPage extends Component {

  _onClickItem = (e) => {
    let action = e.item.action;
    if (action == null)
      return;

    // this.props.dispatch(createAction('DialogModel/login')(action));
    this.props.dispatch(createAction('StoryModel/click')(action));
  }

  _renderSectionHeader = ({ section: { title } }) => {
    return (
      <View>
        <Text style={styles.chatSectionHeader}>{title}</Text>
      </View>
    );
  }

  _renderItem = (data) => {
    return (
      <View style={styles.chatItem}>
        <Button title={data.item.title} onPress={() => this._onClickItem(data)} color="#bcfefe" />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.viewContainer}>
        <View style={styles.posBarContainer}>
          <Text style={styles.posLabel}>位置: {this.props.position}</Text>
        </View>
        <View style={styles.chatContainer}>
          <SectionList
            style={styles.chatSectionList}
            sections={this.props.sectionData}
            extraData={this.props}
            keyExtractor={(item, index) => item + index}
            renderItem={this._renderItem}
            renderSectionHeader={this._renderSectionHeader}
          />
        </View>
        <DialogModal />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  posBarContainer: {
    alignSelf: 'stretch'
  },
  posLabel: {
    fontSize: 18, 
    padding: 10, 
    textAlign: 'left' 
  },
  chatContainer: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10
  },
  chatSectionList: {
    alignSelf: 'stretch'
  },
  chatSectionHeader: {
    fontSize: 18, 
    flex:1, 
    paddingTop: 10, 
    paddingBottom: 10, 
    textAlign: 'center', 
    backgroundColor: "#fff"
  },
  chatItem: {
    backgroundColor: "#003964",
    paddingTop: 2,
    paddingBottom: 2,
    marginVertical: 2
  }
});

export default connect(({ StoryModel }) => ({ ...StoryModel }))(StoryTabPage);