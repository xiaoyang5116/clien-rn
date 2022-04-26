import { View, Text } from 'react-native'
import React from 'react'

const NewMailPage = (props) => {
    React.useEffect(
        () =>
            props.navigation.addListener('beforeRemove', (e) => {
                e.preventDefault();
            }),
        []
    )
    return (
        <View>
            <Text>NewMail</Text>
        </View>
    )
}

export default NewMailPage