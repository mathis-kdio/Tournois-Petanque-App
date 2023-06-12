import * as React from 'react';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

class AdMobBanner extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BannerAd
        unitId={TestIds.BANNER}
        //unitId="ca-app-pub-4863676282747598/3937725790"
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    )
  }
}

export default AdMobBanner