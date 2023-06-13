import * as React from 'react';
import { BannerAd, BannerAdSize, TestIds, AdsConsent } from 'react-native-google-mobile-ads';

class AdMobBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      personalisedAds: true
    }
  }

  async componentDidMount() {
    const {
      createAPersonalisedAdsProfile,
      selectPersonalisedAds,
    } = await AdsConsent.getUserChoices();

    if (selectPersonalisedAds === false || createAPersonalisedAdsProfile == false) {
      this.setState({personalisedAds: false});
    }
  }
  
  render() {
    let unitId = "ca-app-pub-4863676282747598/3937725790";
    if (__DEV__) {
      unitId = TestIds.BANNER;
    }
    return (
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: this.state.personalisedAds
        }}
      />
    )
  }
}

export default AdMobBanner