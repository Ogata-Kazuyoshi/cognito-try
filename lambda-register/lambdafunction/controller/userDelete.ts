import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {AdminDeleteUserCommand} from "@aws-sdk/client-cognito-identity-provider";
import {cognitoClient, userPoolId} from "./cognitoConfig";
import {dynamo, headers} from "./dynamodbConfig";
import {DeleteCommand} from "@aws-sdk/lib-dynamodb";


export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const userId = event.pathParameters?.id;

        if (!userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'ユーザーIDが指定されていません。' }),
            };
        }

        if (!userPoolId) {
            throw new Error('COGNITO_USER_POOL_ID環境変数が設定されていません。');
        }

        // ユーザー削除コマンドの作成
        const deleteUserCommand = new AdminDeleteUserCommand({
            UserPoolId: userPoolId,
            Username: userId,
        });

        await cognitoClient.send<AdminDeleteUserCommand>(deleteUserCommand);
        const getItemParams = {
            TableName: 'ogataUserTable',
            Key: {
                id: userId,
            },
        };
        const data = await dynamo.send(new DeleteCommand(getItemParams));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'ユーザーが正常に削除されました。' }),
        };
    } catch (error) {
        console.error('ユーザー削除エラー:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'ユーザーの削除中にエラーが発生しました。' }),
        };
    }
};