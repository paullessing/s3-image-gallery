import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

// console.log(
//   'PROCESS ENV',
//   JSON.stringify(
//     {
//       IS_OFFLINE: process.env.IS_OFFLINE,
//       S3_ENDPOINT: process.env.S3_ENDPOINT,
//     },
//     null,
//     2
//   )
// );

let options: S3ClientConfig = {};
if (process.env.IS_OFFLINE === 'true') {
  if (!process.env.MINIO_ACCESS_KEY || !process.env.MINIO_ACCESS_KEY) {
    throw new Error('MinIO config is required');
  }
  options = {
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.REGION,
    logger: console,
    credentials: {
      accessKeyId: process.env.MINIO_ACCESS_KEY,
      secretAccessKey: process.env.MINIO_ACCESS_KEY,
    },
  };
}

console.log('Creating S3 Client with options', options);

export default new S3Client({
  ...options,
});
