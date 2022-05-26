import { View, Text, DeviceEventEmitter } from 'react-native'
import React, { useState } from 'react'
import lo from 'lodash';

import {
    connect,
    Component,
    StyleSheet,
    action,
    EventKeys,
    AppDispath,
    DataContext,
    getWindowSize
} from "../../constants";

import Collapse from '../../components/collapse';
import CluesList from '../../components/cluesList/CluesList'
import { TextButton } from '../../constants/custom-ui';

const UserAttributesHolder = (props) => {
    const [data, setData] = React.useState(props.config);

    React.useEffect(() => {
        const listener = DeviceEventEmitter.addListener(EventKeys.USER_ATTR_UPDATE, () => {
            const cb = (result) => {
                const newData = lo.cloneDeep(data);
                result.forEach(e => {
                    const { key, value } = e;
                    newData.forEach(e => {
                        e.data.forEach(e => {
                            e.forEach(e => {
                                if (e.key == key) {
                                    e.value = value;
                                }
                            })
                        });
                    });
                });
                //
                setData(newData);
            };
            AppDispath({ type: 'UserModel/getAttrs', cb });
        });

        // 更新角色属性
        DeviceEventEmitter.emit(EventKeys.USER_ATTR_UPDATE);

        return () => {
            listener.remove();
        }
    }, []);

    return (
        <Collapse
            data={data}
            renderItem={(item) => {
                return (
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: 50 }}><Text>{item.title}:</Text></View>
                        <View><Text style={{ color: '#666' }}>{item.value}</Text></View>
                    </View>
                );
            }}
            renderGroupHeader={(section) => {
                return (
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>{section.title}</Text>
                );
            }}
        />
    );
}


const ReaderDrawer = (props) => {
    const { attrsConfig } = props
    const [key, setKey] = useState('UserAttributesHolder')

    const renderContent = () => {
        switch (key) {
            case "UserAttributesHolder":
                return (attrsConfig != null) ? <UserAttributesHolder config={attrsConfig} /> : <></>
            case "cluesList":
                return <CluesList />
        }
    }

    return (
        <View style={{ flex: 1, position: "relative" }}>
            {/* {(attrsConfig != null) ? <UserAttributesHolder config={attrsConfig} /> : <></>} */}
            <View style={{ position: "absolute", left: -50, top: 20, zIndex: 100, width: 50 }}>
                <TextButton title={"属性"} onPress={() => { setKey("UserAttributesHolder") }} />
                <TextButton title={"线索"} onPress={() => { setKey("cluesList") }} />
            </View>
            {renderContent()}
        </View>
    )
}

export default ReaderDrawer