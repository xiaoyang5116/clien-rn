import React from 'react';
import lo from 'lodash';

import { AppDispath } from '../../constants';
import { CarouselUtils } from '../../components/carousel';

const WORLD = [
    {
      worldId: 0,
      title: "现实",
      body: "现实场景，这里添加更多描述",
      desc: "现实场景，这里添加更多描述, 现实场景，这里添加更多描述, 现实场景，这里添加更多描述, 现实场景，这里添加更多描述",
      imgUrl: "https://picsum.photos/id/11/200/300",
      toChapter: "WZXX_M1_N1_C001",
    },
    {
      worldId: 1,
      title: "尘界",
      body: "尘界场景，这里添加更多描述",
      desc: "尘界场景，这里添加更多描述，尘界场景，这里添加更多描述，尘界场景，这里添加更多描述，尘界场景，这里添加更多描述",
      imgUrl: "https://picsum.photos/id/12/200/300",
      toChapter: "WZXX_M1_N1_C001",
    },
    {
      worldId: 2,
      title: "灵修界",
      body: "灵修场景，这里添加更多描述",
      desc: "灵修场景，这里添加更多描述, 灵修场景，这里添加更多描述, 灵修场景，这里添加更多描述, 灵修场景，这里添加更多描述",
      imgUrl: "https://picsum.photos/id/10/200/300",
      toChapter: "WZXX_M1_N1_C001",
    },
];

const WorldSelector = () => {
    CarouselUtils.show({ 
      data: WORLD, 
      initialIndex: Math.floor(WORLD.length / 2), 
      onSelect: (p) => {
        if (p.item.toChapter != undefined) {
          AppDispath({ type: 'SceneModel/processActions', payload: { toChapter: p.item.toChapter, __sceneId: '' } });
        }
      }
    });
}

export default WorldSelector;