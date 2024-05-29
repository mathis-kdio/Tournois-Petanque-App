import * as React from 'react';
import { Adsense } from '@ctrl/react-adsense';

export interface Props {
}

interface State {
}

//Cas web => voir AdMobInscriptionsBanner.native.js pour android et ios
class AdMobInscriptionsBanner extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  
  render() {
    return (
      <Adsense
        client="ca-pub-4863676282747598"
        slot="4936658878"
        adTest={__DEV__ ? "on" : "off"}
      />
    )
  }
}

export default AdMobInscriptionsBanner