import {
  CognitoIdentityProviderClient,
  DescribeUserPoolCommand,
  AdminUpdateUserAttributesCommand,
  ResendConfirmationCodeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import config from "../config.json";

export const cognitoClient = new CognitoIdentityProviderClient({
  region: config.region,
  credentials: {
    accessKeyId: import.meta.env.ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.SECRET_ACCESS_KEY,
  },
});

export const getUserPoolConfig = async () => {
  const command = new DescribeUserPoolCommand({ UserPoolId: config.userPoolId });

  try {
    const userPoolResponse = await cognitoClient.send(command);
    console.log('user pool config', userPoolResponse.UserPool);

    return userPoolResponse
  } catch (error) {
    console.error(error);
  }
};

export const resendConfirmationCode = async (username: string) => {
  const command = new ResendConfirmationCodeCommand({
    ClientId: config.clientId,
    Username: username
  });

  try {
    const resendConfirmationCode = await cognitoClient.send(command);
    console.log('resend confirmation code', resendConfirmationCode);

    return resendConfirmationCode
  } catch (error) {
    console.error(error);
  }
};

export const enableUserCommand = async (username: string) => {
  const command = new AdminUpdateUserAttributesCommand({
    UserPoolId: config.userPoolId,
    Username: username,
    UserAttributes: [
      {
        Name: 'custom:login_attempts',
        Value: '0'
      }
    ]
  });

  try {
    const enableUserCommandResponse = await cognitoClient.send(command);
    console.log('user command', enableUserCommandResponse);

    return enableUserCommandResponse
  } catch (error) {
    console.error(error);
  }
};




