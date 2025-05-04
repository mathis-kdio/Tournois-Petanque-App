import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';

const REVIEW_REQUEST_KEY = 'lastReviewRequestDate';
const REVIEW_REQUEST_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 jours en millisecondes

export const requestReview = async () => {
  const lastRequestDate = await AsyncStorage.getItem(REVIEW_REQUEST_KEY);
  const now = new Date().getTime();

  let canRequest =
    lastRequestDate === null ||
    now - parseInt(lastRequestDate, 10) > REVIEW_REQUEST_INTERVAL;

  if (
    (await StoreReview.isAvailableAsync()) &&
    (await StoreReview.hasAction()) &&
    canRequest
  ) {
    StoreReview.requestReview();
    await AsyncStorage.setItem(REVIEW_REQUEST_KEY, now.toString());
  }
};
