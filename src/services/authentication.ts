
import { fetchAuthSession, signInWithRedirect, signIn, signOut } from 'aws-amplify/auth';

// import { adGroupPrefix, configAuthUrl, callAPI, instance, ldapUrl } from './serviceController';

export const signInUser = async (username, password) => {
    const { nextStep } = await signIn({ username, password });
    return nextStep;
}

export const  signOutUser = async () => {
    await signOut({ global: true });
}

// export function initializeSession(
//     firstName,
//     lastName,
//     username,
//     orgName,
//     deptId,
//     userInfo,
//     defaultDepartment,
//     regionOverride,
//     objectPermissionsHexZip,
// ) {
//     const URL = 'utility/initializeSession';

//     const body = {
//         adGroupList: JSON.stringify(userInfo['custom:groups']?.replace(/^\[+|\]+$/g, '')?.split(',')),
//         defaultDepartment: defaultDepartment || 'N',
//         departmentId: deptId,
//         firstName,
//         // language: getAppLanguageFromBrowser(), dont pass in language default to the user setting value
//         lastName,
//         organization: orgName,
//         username,
//         objectPermissionsHexZip,
//     };

//     const errorCallback = (error) => {
//         throw error;
//     };

//     const successCallback = (response) => {
//         if (response.userSession === null || response.userSession === undefined) {
//             errorCallback(response);
//         }
//         sessionStorage.setItem('sfiDbSession', JSON.stringify(response));
//         return response;
//     };

//     return callAPI(URL, 'POST', body, null, null, true, false, regionOverride)
//         .then((response) => {
//             // window.location.reload(true);
//             return successCallback(response);
//         })
//         .catch((error) => {
//             errorCallback(error);
//         });
// }

/**
 * Get session from local storage, or create one if one does not exist.
 *
 * @return { Promise } Promise that resolves the database session
 */
// export function getDatabaseSession() {
//     return new Promise((resolve, reject) => {
//         // Get the session data from sessionStorage.
//         const userSessionId = sessionStorage.getItem('userSessionId');
//         if (userSessionId && userSessionId !== 'undefined' && userSessionId !== 'null') {
//             resolve(userSessionId);
//         } else {
//             if (window.location.pathname !== '/login') {
//                 // sessionStorage.removeItem('userInfo');
//                 // sessionStorage.removeItem('userDept');
//                 // sessionStorage.removeItem('userOrg');
//                 // window.location.pathname = '/login';
//             }
//             reject(new Error(`There is no valid database session: ${userSessionId}`));
//             // logoutUser();
//             // // Get the user information
//             // getUserInfo()
//             //     .then((user) => {
//             //         logToConsole('user', user);
//             //         // initialize the database session
//             //         return initializeSession(user).then(() => {
//             //             const dbSession = JSON.parse(sessionStorage.getItem('sfiDbSession'));
//             //             resolve(dbSession);
//             //         });
//             //     })
//             //     .catch((error) => {
//             //         logToConsole('failed to get user info', error);
//             //         reject();
//             //     });
//         }
//     });
// }

/**
 * Acquires an access token which is attached to a request for AWS. Silently acquires an access token which is then attached to a request for AWS.
 *
 * @return { Promise } A promise that resolves with the access token or rejects with an error message if there is an error
 */
export function getJwtAccessToken() {
    return fetchAuthSession()
        .then((session) => {
            return session.tokens?.accessToken?.toString();
        })
        .catch((error) => {
            console.log(error);
        });
}


/**
 * The function `getAWSConfig` makes an API call to retrieve AWS configuration and returns the response
 * if successful, otherwise throws an error.
 * @returns a promise that resolves to the response from the `callAPI` function.
 */

// export function getAWSAuthConfig() {
//     const successCallback = (response) => {
//         return response;
//     };

//     const errorCallback = (error) => {
//         throw error;
//     };

//     return callAPI(configAuthUrl, 'GET', null, null, null, false, false)
//         .then((response) => {
//             return successCallback(response);
//         })
//         .catch((error) => {
//             errorCallback(error);
//         });
// }

/**
 * The function `getAWSProvider` makes an API call to retrieve the AWS provider and returns it.
 * @returns a promise that resolves to the value returned by the successCallback function.
 */

// export function getAWSProvider() {
//     const successCallback = (response) => {
//         return response.identityProviderName;
//     };

//     const errorCallback = (error) => {
//         throw error;
//     };

//     return callAPI(configAuthUrl, 'GET')
//         .then((response) => {
//             return successCallback(response);
//         })
//         .catch((error) => {
//             errorCallback(error);
//         });
// }

// export const handleSSOLogin = (providerType) => {
//     fetchAuthSession().then((session) => {
//         if (session.tokens) {
//             fetchAuthSession();
//         } else {
//             getAWSProvider()
//                 .then((providerName) => {
//                     if (providerType === 'FEDERATED') {
//                         const provider = {
//                             custom: providerName,
//                         };
//                         signInWithRedirect({ provider });
//                     } else if (providerType === 'LOCAL') {
//                         signInWithRedirect();
//                     }
//                 })
//                 .catch((error) => {
//                     errorToConsole(error);
//                 });
//         }
//     });
// };


