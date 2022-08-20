import React from 'react';
import Video from 'react-native-video';

import { 
    View, 
} from 'react-native';


const TransAnimation = (props) => {

  const refVideo = React.useRef(null);

  React.useEffect(() => {
      refVideo.current.seek(0);
  }, []);

  const end = () => {
    if (props.onCompleted != undefined) { 
      props.onCompleted(); 
    }
  }

  return (
      <View style={{ flex: 1, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Video 
              style={{ width: '100%', height: '100%' }}
              ref={(ref) => refVideo.current = ref}
              source={require('../../../assets/mp4/CSSK_V1.mp4')}
              fullscreen={false}
              resizeMode={'stretch'}
              onEnd={() => { end() }}
          />
      </View>
  );
}

export default TransAnimation;