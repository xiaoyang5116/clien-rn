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
    const value = percent * 300;
    const translateX = 300 - value;

    return (
        <>
            <View style={{ height: 10, width: 300, backgroundColor: "#e0e0e0", borderRadius: 12, overflow: 'hidden', position: "absolute" }}>
                <View style={{
                    position: "absolute", top: 0, left: -300, height: 10, width: "100%", backgroundColor: "#33ad85", zIndex: 0,
                    transform: [{ translateX: translateX }]
                }} ></View>

            </View>
            <Text style={{ textAlign: 'center' }}>{(100 - Math.floor(percent * 100))}%</Text>
        </>
    )
}

export default connect((state) => ({ ...state.PlantModel }))(UndoneProgressBar);

const styles = StyleSheet.create({})