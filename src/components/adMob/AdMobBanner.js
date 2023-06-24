import { VStack } from 'native-base';
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
    let unitId = undefined;
    if (__DEV__) {
      unitId = TestIds.BANNER;
    }
    else if (Platform.OS === 'android') {
      unitId = "ca-app-pub-4863676282747598/3937725790";
    }
    else if (Platform.OS === 'ios') {
      unitId = "ca-app-pub-4863676282747598/3784972118";
    }
    else {
      console.log("Plateforme non prise en charge pour admob banner");
    }
    if (!unitId) return;
    return (
      <VStack alignItems="center">
        <BannerAd
          unitId={unitId}
          size={BannerAdSize.FULL_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: this.state.personalisedAds
          }}
        />
      </VStack>
    )
  }
}

export default AdMobBanner