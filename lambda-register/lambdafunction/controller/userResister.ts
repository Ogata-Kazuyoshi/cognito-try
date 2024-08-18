import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {
    AdminCreateUserCommand,
    AdminCreateUserCommandInput,
    UsernameExistsException,
} from '@aws-sdk/client-cognito-identity-provider';
import {PutCommand} from '@aws-sdk/lib-dynamodb';
import {dynamo, headers} from "./dynamodbConfig";
import {AdminCreateUserResponse, cognitoClient, EventBody, userPoolId} from "./cognitoConfig";


export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const body: EventBody = JSON.parse(event.body || '{}') ;

        if (!body.userEmail || typeof body.userEmail !== 'string') {
            throw new Error('Invalid or missing userEmail in request body');
        }
        const userEmail = body.userEmail;

        if (!userPoolId) {
            throw new Error('USER_POOL_ID is not set');
        } else {
            console.log({ USER_POOL_ID: userPoolId });
        }

        const params: AdminCreateUserCommandInput = {
            UserPoolId: userPoolId,
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

        const command = new AdminCreateUserCommand(params);
        const response = await cognitoClient.send<AdminCreateUserCommand>(command);
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
            headers: headers,
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
