// /utils/s3.js

import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: 'AKIA3CPTENMDTQZUJGVG',
  secretAccessKey: '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',
  region: 'ap-southeast-2',
});

export default s3;
