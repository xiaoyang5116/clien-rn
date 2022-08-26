import { StyleSheet, Text, View } from 'react-native'
import React from 'react'


const ProgressBar = (props) => {
  const { needTime, currentNeedTime, onFinish } = props
  const [seconds, setSeconds] = React.useState(currentNeedTime);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((sec) => {
        if (sec <= 0) {
          clearInterval(timer);
          setTimeout(() => {
            timeOutHandler();
          }, 0);
          return 0;
        }
        return sec - 1;
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    }
  }, []);

  const timeOutHandler = () => {
    onFinish()
  }

  const percent = seconds / needTime;
  const value = percent * 300;
  const translateX = 300 - value;

  return (
    <>
      <View style={{ height: 15, width: 300, backgroundColor: "#e0e0e0", borderRadius: 12, overflow: 'hidden', }}>
        <View style={{
          position: "absolute", top: 0, left: -300, height: 15, width: "100%", backgroundColor: "#33ad85", zIndex: 0,
          transform: [{ translateX: translateX }]
        }} ></View>

      </View>
      <Text style={{ textAlign: 'center', position: "absolute" }}>{(100 - Math.floor(percent * 100))}%</Text>
    </>
  )
}

export default ProgressBar

const styles = StyleSheet.create({})