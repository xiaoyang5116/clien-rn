import { View, Text } from 'react-native'
import React from 'react'

import BoomModel from './Boom'

const Onomatopoeia = (props) => {
    const { typeId } = props
    switch (typeId) {
        case 1:
            return BoomModel.show(props)
    }
}

export default Onomatopoeia