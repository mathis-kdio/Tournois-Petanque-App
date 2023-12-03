import VersionCheck from 'react-native-version-check-expo';

export const _versionCheck = async () => {
  return await VersionCheck.needUpdate().then(async res => {
    if (res != null && res.isNeeded && this.state.modalVisible != true) {
      return true;
    }
    return false;
  })
}