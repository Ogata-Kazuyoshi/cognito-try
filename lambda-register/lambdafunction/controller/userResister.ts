import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
    CognitoIdentityProviderClient,
    AdminCreateUserCommand,
    AdminCreateUserCommandInput,
    AdminCreateUserCommandOutput,
    UsernameExistsException,
} from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

// @ts-ignore
const cognitoClient = new CognitoIdentityProviderClient({ region: 'ap-northeast-1' });
const USER_POOL_ID = process.env.USER_POOL_ID;

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
const dynamo = DynamoDBDocumentClient.from(client);

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        interface EventBody {
            userEmail: string;
        }

        const body = JSON.parse(event.body || '{}') as EventBody;

        if (!body.userEmail || typeof body.userEmail !== 'string') {
            throw new Error('Invalid or missing userEmail in request body');
        }
        const userEmail = body.userEmail;

        if (!USER_POOL_ID) {
            throw new Error('USER_POOL_ID is not set');
        } else {
            console.log({ USER_POOL_ID });
        }

        const params: AdminCreateUserCommandInput = {
            UserPoolId: USER_POOL_ID,
            Username: userEmail,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: userEmail,
                },
                {
                    Name: 'email_verified',
                    Value: 'true',
                },
            ],
            DesiredDeliveryMediums: ['EMAIL'],
            ForceAliasCreation: false,
        };

        type AdminCreateUserResponse = {
            User: {
                Username: string;
                UserStatus: string;
                Enabled: boolean;
                UserCreateDate: Date;
                UserLastModifiedDate: Date;
                Attributes: { Name: string; Value: string }[];
            };
        };

        const command = new AdminCreateUserCommand(params);
        const response = await cognitoClient.send<AdminCreateUserCommandOutput>(command);
        const userId = response as AdminCreateUserResponse;

        const putItemParams = {
            TableName: 'ogataUserTable',
            Item: {
                id: userId.User.Username,
                email: userEmail,
                date: new Date().toISOString(),
            },
        };
        const data = await dynamo.send(new PutCommand(putItemParams));
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'POST,OPTIONS',
            },
            body: JSON.stringify({
                message: `ユーザー ${userEmail} を作成し、招待メールを送信しました。DynamoDBへの登録も完了です`,
                userId: userId.User?.Username,
                data: data,
            }),
        };
    } catch (err) {
        console.error('Error creating user:', err);
        let statusCode = 500;
        let message = 'ユーザー作成中にエラーが発生しました';

        if (err instanceof UsernameExistsException) {
            statusCode = 400;
            message = 'ユーザーは既に存在します';
        }

        return {
            statusCode,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'POST,OPTIONS',
            },
            body: JSON.stringify({
                message,
                error: err instanceof Error ? err.message : 'Unknown error',
            }),
        };
    }
};
