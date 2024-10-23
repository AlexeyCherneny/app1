const aplifyConfig = {
  Auth: {
    Cognito: {
      "region": import.meta.env.REGION,
      "userPoolId": import.meta.env.USER_POOL_ID,
      "userPoolClientId": import.meta.env.USER_POOL_CLIENT_ID,
    },
  },

}

export default aplifyConfig