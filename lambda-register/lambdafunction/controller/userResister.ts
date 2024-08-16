import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
    CognitoIdentityProviderClient,
    AdminCreateUserCommand,
    AdminCreateUserCommandInput,
    AdminCreateUserCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';

// @ts-ignore
const cognitoClient = new CognitoIdentityProviderClient({ region: 'ap-northeast-1' });
const USER_POOL_ID = process.env.USER_POOL_ID;

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // イベントボディの型を定義
        interface EventBody {
            userEmail: string;
        }

        // イベントボディをパースし、型チェックを行う
        const body = JSON.parse(event.body || '{}') as EventBody;

        // 型ガードを使用して、userEmailが存在することを確認
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
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'POST,OPTIONS',
            },
            body: JSON.stringify({
                message: `ユーザー ${userEmail} を作成し、招待メールを送信しました`,
                userId: userId.User?.Username,
            }),
        };
    } catch (err) {
        console.error('Error creating user:', err);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'POST,OPTIONS',
            },
            body: JSON.stringify({
                message: 'ユーザー作成中にエラーが発生しました',
                error: err instanceof Error ? err.message : 'Unknown error',
            }),
        };
    }
};
