import {CognitoIdentityProviderClient,} from '@aws-sdk/client-cognito-identity-provider';
// @ts-ignore
export const cognitoClient = new CognitoIdentityProviderClient({ region: 'ap-northeast-1' });
export const userPoolId = process.env.USER_POOL_ID;

export  interface EventBody {
    userEmail: string;
}

export interface AdminCreateUserResponse  {
    User: {
        Username: string;
        UserStatus: string;
        Enabled: boolean;
        UserCreateDate: Date;
        UserLastModifiedDate: Date;
        Attributes: { Name: string; Value: string }[];
    };
}