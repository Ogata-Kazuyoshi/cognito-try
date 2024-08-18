import {DynamoDBClient, DynamoDBClientConfig} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";

const clientConfig: DynamoDBClientConfig = process.env.AWS_SAM_LOCAL
    ? {
        region: 'ap-northeast-1',
        endpoint: 'http://dynamodb-local:8000',
        credentials: {
            accessKeyId: 'dummy',
            secretAccessKey: 'dummy',
        },
    }
    : {};

// @ts-ignore
const client = new DynamoDBClient(clientConfig);
export const dynamo = DynamoDBDocumentClient.from(client);

export const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
}
