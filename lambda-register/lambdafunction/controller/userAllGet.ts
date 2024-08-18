import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {dynamo, headers} from "./dynamodbConfig";
import {ScanCommand} from "@aws-sdk/lib-dynamodb";
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const scanParams = {
            TableName: 'ogataUserTable',
        };
        const data = await dynamo.send(new ScanCommand(scanParams));
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data.Items),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
