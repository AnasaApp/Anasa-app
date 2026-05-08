import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

function normalizeAsset(asset) {
  return {
    path: asset.uri,
    uri: asset.uri,
    type: asset.type || 'image/jpeg',
    fileName: asset.fileName || `${Date.now()}.jpg`,
    width: asset.width,
    height: asset.height,
  };
}

export function openCamera(options = {}) {
  const opts = {
    mediaType: 'photo',
    quality: 0.6,
    maxWidth: 1024,
    maxHeight: 1024,
    saveToPhotos: false,
    includeBase64: false,
    ...options,
  };
  return new Promise((resolve, reject) => {
    launchCamera(opts, response => {
      if (response.didCancel) {return reject(new Error('User cancelled'));}
      if (response.errorCode) {return reject(new Error(response.errorMessage || response.errorCode));}
      const asset = response.assets && response.assets[0];
      if (!asset) {return reject(new Error('No image returned'));}
      resolve(normalizeAsset(asset));
    });
  });
}

export function openPicker(options = {}) {
  const opts = {
    mediaType: 'photo',
    quality: 0.6,
    maxWidth: 1024,
    maxHeight: 1024,
    selectionLimit: 1,
    includeBase64: false,
    // Use Android Photo Picker — requires NO storage permissions
    // Works on Android 13+ natively, falls back gracefully on older versions
    presentationStyle: 'pageSheet',
    ...options,
  };
  return new Promise((resolve, reject) => {
    launchImageLibrary(opts, response => {
      if (response.didCancel) {return reject(new Error('User cancelled'));}
      if (response.errorCode) {return reject(new Error(response.errorMessage || response.errorCode));}
      const asset = response.assets && response.assets[0];
      if (!asset) {return reject(new Error('No image returned'));}
      resolve(normalizeAsset(asset));
    });
  });
}

export default {
  openCamera,
  openPicker,
};
