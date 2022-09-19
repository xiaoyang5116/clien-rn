import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { HalfPanel } from '../../panel'
import { TextButton } from '../../../constants/custom-ui';

const UpgradePage = (props) => {
  const { mainAttr, onClose } = props
  console.log("props", props);
  return (
    <HalfPanel backgroundColor={"rgba(0,0,0,0.7)"} borderRadius={10} zIndex={99} style={{ backgroundColor: "#ccc" }}>
      <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', }}>
        <View style={{ width: "90%", height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: "#A0A0A0", marginTop: 12, borderRadius: 8 }}>
          <Text style={{ fontSize: 20, color: "#000" }}>{mainAttr.name}</Text>
        </View>
        <View style={{}}>
          
        </View>
        <View>

        </View>

        <View style={styles.goBackContainer}>
          <TextButton title={"返回"} onPress={onClose} />
        </View>
      </View>
    </HalfPanel>
  )
}

export default UpgradePage

const styles = StyleSheet.create({
  goBackContainer: {
    width: "90%",
    marginBottom: 12
  }
})