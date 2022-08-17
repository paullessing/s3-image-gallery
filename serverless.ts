import type { AWS } from '@serverless/typescript';
import { manageImages } from '@functions/images';

const serverlessConfiguration: AWS = {
  service: 'template',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    region: 'eu-west-2',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      S3_ENDPOINT: '${env:S3_ENDPOINT}',
      MINIO_ACCESS_KEY: '${env:MINIO_ACCESS_KEY}',
      MINIO_SECRET_KEY: '${env:MINIO_SECRET_KEY}',
      DYNAMO_ENDPOINT: '${env:DYNAMO_ENDPOINT}',
      REGION: '${env:REGION}',
    },
  },
  functions: {
    manageImages,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: 'inline',
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      tsconfig: 'tsconfig.build.json',
      watch: {
        pattern: ['src/**/*.ts'],
        ignore: ['src/**/*.spec.ts', 'src/**/*.router.ts', 'src/functions/**/index.ts'],
      },
    },
    'serverless-offline': {
      httpPort: 4000,
      noAuth: true,
      noPrependStageInUrl: true,
    },
  },
};

module.exports = serverlessConfiguration;
