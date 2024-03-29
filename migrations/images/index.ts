import { DynamoDB } from 'aws-sdk';
import { CreateTableInput } from 'aws-sdk/clients/dynamodb';

(async () => {
  console.time('migrate');
  console.log('Start...');

  const ddb = new DynamoDB({
    endpoint: process.env.DYNAMO_ENDPOINT,
    region: process.env.REGION,
    apiVersion: '2012-08-10',
    httpOptions: {
      connectTimeout: 5000,
    },
  });

  // const ddbDoc = new DocumentClient({
  //   service: ddb,
  // });

  const createTableInput: CreateTableInput = {
    TableName: 'Images',
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH',
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S',
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10,
    },
  };

  await ddb
    .deleteTable({ TableName: 'Images' })
    .promise()
    .catch(() => null);
  await ddb.createTable(createTableInput).promise();

  // const batchWriteInput = {
  //   RequestItems: {
  //     Movies: [],
  //   },
  // } as DocumentClient.BatchWriteItemInput;
  //
  // for (const movie of movies) {
  //   console.log('Put: ', movie.title);
  //
  //   batchWriteInput.RequestItems.Movies.push({
  //     PutRequest: {
  //       Item: movie,
  //     },
  //   });
  //
  //   if (batchWriteInput.RequestItems.Movies.length % 25 === 0) {
  //     // eslint-disable-next-line no-await-in-loop
  //     await ddbDoc.batchWrite(batchWriteInput).promise();
  //     batchWriteInput.RequestItems.Movies = [];
  //   }
  // }
  //
  // if (batchWriteInput.RequestItems.Movies.length) {
  //   await ddbDoc.batchWrite(batchWriteInput).promise();
  // }

  console.timeEnd('migrate');
  console.log('Done!');
})();
