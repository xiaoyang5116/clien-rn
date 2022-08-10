import { View, Text } from 'react-native'
import React from 'react'

import BoomModel from './Boom'
import SouSouModel from './SouSou'
import AQiuModel2 from './AQiu2'
import AModel from './A'
import HuHuModel from './HuHu'
import KuangDangModal from './KuangDang'
import GaZhiModal from './GaZhi'
import DaGeModal from './DaGe'
import BengModal from './Beng'


const Onomatopoeia = (props) => {
    const { typeId } = props
    switch (typeId) {
        case 1:
            return BoomModel.show(props)
        case 2:
            return SouSouModel.show(props)
        case 3:
            return AQiuModel2.show(props)
        case 4:
            return AModel.show(props)
        case 5:
            return HuHuModel.show(props)
        case 6:
            return KuangDangModal.show(props)
        case 7:
            return GaZhiModal.show(props)
        case 8:
            return DaGeModal.show(props)
        case 9:
            return BengModal.show(props)
    }
}

export default Onomatopoeia