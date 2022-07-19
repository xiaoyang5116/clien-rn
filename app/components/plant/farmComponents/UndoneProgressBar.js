import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { action, connect, EventKeys } from "../../../constants"

const UndoneProgressBar = (props) => {
    const { needTime, currentNeedTime, lingTianName, lingTianId } = props
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
        props.dispatch(action("PlantModel/changePlantStatus")({ lingTianName, lingTianId, status: 3 }))
    }

    const percent = seconds / needTime;
    const value = percent * 100;
    const translateX = 100 - value;

    // let translateX = 50
    return (
        <View style={{ height: 20, width: 100, backgroundColor: "#d9d9d9", borderRadius: 12, overflow: 'hidden' }}>
            <View style={{
                position: "absolute", top: 0, left: -100, height: 20, width: "100%", backgroundColor: "#595959", zIndex: 0,
                transform: [{ translateX: translateX }]
            }} ></View>
            <Text style={{ textAlign: 'center' }}>{(100 - Math.floor(percent * 100))}%</Text>
        </View>
    )
}

export default connect((state) => ({ ...state.PlantModel }))(UndoneProgressBar);

const styles = StyleSheet.create({})