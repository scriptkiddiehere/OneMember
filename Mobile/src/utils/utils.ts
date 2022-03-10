import {RNS3} from 'react-native-aws3';

const ACCESS_KEY = 'AKIAY4XV4G23W7X7RSU7';
const SECRET_KEY = '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';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {Share} from 'react-native';

const s3Options: any = {
  bucket: 'onemembr',
  region: 'eu-central-1',
  accessKey: ACCESS_KEY,
  secretKey: SECRET_KEY,
};
export const uploadToS3 = async (url: string, name: any) => {
  const file: any = {
    uri: url,
    name: name,
    type: 'image/jpeg',
  };
  const s3 = await RNS3.put(file, s3Options);
  console.log(s3);
  return s3.body.postResponse.location;
};

export const shareLink = async (roomId: string) => {
  const link = await dynamicLinks().buildShortLink({
    link: 'https://app.onemembr.com/' +roomId,
    android: {
      packageName: 'com.onemember_ui',
    },

    domainUriPrefix: 'https://app.onemembr.com',
  });
  console.log(link);

  return link;
};

export const roomIdFromUrl = async (url: string) => {
  url = url.replace('https://app.onemembr.com/', '');
  url = url.replace('http://app.onemembr.com/', '');
  url = url.replace('/', '');
  return url;
};
