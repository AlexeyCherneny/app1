import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import {
  fetchAuthSession,
  getCurrentUser,
  signIn,
  confirmSignIn,
  autoSignIn,
  signUp,
  confirmSignUp,
  signOut,
  resetPassword,
  confirmResetPassword,
} from 'aws-amplify/auth';
import { type SignUpOutput, type SignInOutput, type ConfirmSignUpOutput, type ResetPasswordOutput } from 'aws-amplify/auth';
import { resendConfirmationCode, enableUserCommand } from './authService';
import { useNavigate } from 'react-router-dom';

interface IAuthenticationContextState {
  isAuthenticated: boolean;
  isInitialized: boolean;

  accessToken: string | null;
  idToken: string | null;

  signInDetails: {
    loginId: string | null;
  };

  isSigningIn: boolean;
  handleSignIn: (userName: string, password: string) => Promise<any>;

  isChangingPassword: boolean;
  handleChangePassword: (newPassword: string) => Promise<any>;

  isSigningUp: boolean;
  handleSignUp: (userName: string, password: string, confirmPassword: string) => Promise<any>;

  isConfirmSigningUp: boolean;
  handleConfirmSignUp: (userName: string, confirmationCode: string) => Promise<any>;

  isSigningOut: boolean;
  handleSignOut: () => Promise<any>;

  isResettingPassword: boolean;
  handleResetPassword: (email: string) => Promise<any>;

  isConfirmingResetPassword: boolean;
  handleConfirmResetPassword: (email: string, confirmationCode: string, newPassword: string, confirmNewPassword: string) => Promise<any>;

  isResendConfirmationCode: boolean;
  handleResendConfirmationCode: (username: string) => Promise<any>;
}

const AuthenticationContext = createContext<IAuthenticationContextState>({
  isAuthenticated: false,
  isInitialized: false,

  accessToken: null,
  idToken: null,

  signInDetails: {
    loginId: null,
  },

  isSigningIn: false,
  handleSignIn: (userName: string, password: string) => Promise.resolve(),

  isChangingPassword: false,
  handleChangePassword: (newPassword: string) => Promise.resolve(),

  isSigningUp: false,
  handleSignUp: (userName: string, password: string, confirmPassword: string) => Promise.resolve(),

  isConfirmSigningUp: false,
  handleConfirmSignUp: (userName: string, confirmationCode: string) => Promise.resolve(),

  isSigningOut: false,
  handleSignOut: () => Promise.resolve(),

  isResettingPassword: false,
  handleResetPassword: (email: string) => Promise.resolve(),

  isConfirmingResetPassword: false,
  handleConfirmResetPassword: (email: string, confirmationCode: string, newPassword: string, confirmNewPassword: string) =>
    Promise.resolve(),

  isResendConfirmationCode: false,
  handleResendConfirmationCode: (username: string) => Promise.resolve(),
});

const AuthenticationProvider = (props) => {
  const navigate = useNavigate();

  const [isInitialized, setIsInitialized] = useState(false);
  const [session, setSession] = useState(null);

  const checkSession = useCallback(async () => {
    const session = await fetchAuthSession();

    if (session.userSub) {
      const currentUser = await getCurrentUser();
      console.log('currentUser: ', currentUser);

      setSession(session);
    }

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const signInDetails = useMemo(() => session?.tokens?.signInDetails, []);

  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = useCallback(
    async (email, password) => {
      try {
        setIsSigningIn(true);

        await enableUserCommand(email);
        const signInResponse = await signIn({ username: email, password });
        // debugger

        // TODO: Implement missing steps

        // CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE - The sign-in must be confirmed with a custom challenge response. Complete the process with confirmSignIn.
        // CONFIRM_SIGN_IN_WITH_TOTP_CODE - The sign-in must be confirmed with a TOTP code from the user. Complete the process with confirmSignIn.
        // CONTINUE_SIGN_IN_WITH_TOTP_SETUP - The TOTP setup process must be continued. Complete the process with confirmSignIn.
        // CONFIRM_SIGN_IN_WITH_SMS_CODE - The sign-in must be confirmed with a SMS code from the user. Complete the process with confirmSignIn.
        // CONTINUE_SIGN_IN_WITH_MFA_SELECTION - The user must select their mode of MFA verification before signing in. Complete the process with confirmSignIn.
        switch (signInResponse.nextStep.signInStep) {
          case 'CONFIRM_SIGN_UP' as unknown as SignInOutput['nextStep']['signInStep']: {
            navigate('/confirm', { state: { email } });
            break;
          }
          case 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED' as unknown as SignInOutput['nextStep']['signInStep']: {
            navigate('/change-password', { state: { password } });
            break;
          }
          case 'RESET_PASSWORD' as unknown as SignInOutput['nextStep']['signInStep']: {
            navigate('/confirm-reset-password', { state: { email } });
            break;
          }
          case 'DONE' as unknown as SignInOutput['nextStep']['signInStep']: {
            navigate('/home');
            break;
          }
          default: {
            console.log('Unhandled next step for signIn: ', signInResponse.nextStep.signInStep);
          }
        }

        await checkSession();
      } catch (error) {
        // debugger

        if (error.message === 'Password attempts exceeded') {
        }
        console.log('Something went wrong during signing in: ', error);
      } finally {
        setIsSigningIn(false);
      }
    },
    [navigate],
  );

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = useCallback(
    async (newPassword) => {
      try {
        setIsChangingPassword(true);

        const updatePasswordResponse = await confirmSignIn({
          challengeResponse: newPassword,
        });

        // debugger

        await checkSession();

        navigate('/home');
      } catch (error) {
        console.log('Something went wrong during changing password: ', error);
      } finally {
        setIsChangingPassword(false);
      }
    },
    [navigate],
  );

  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSignUp = useCallback(
    async (email, password, confirmPassword) => {
      try {
        if (password !== confirmPassword) {
          alert('Passwords do not match');
          return;
        }

        setIsSigningIn(true);

        const signUpResponse = await signUp({ username: email, password, options: { userAttributes: { email } } });

        // debugger

        switch (signUpResponse.nextStep.signUpStep) {
          case 'CONFIRM_SIGN_UP' as unknown as SignUpOutput['nextStep']['signUpStep']: {
            navigate('/confirm', { state: { email } });
            break;
          }
          case 'COMPLETE_AUTO_SIGN_IN' as unknown as SignUpOutput['nextStep']['signUpStep']: {
            await autoSignIn();
            navigate('/home');
            break;
          }
          case 'DONE' as unknown as SignUpOutput['nextStep']['signUpStep']: {
            navigate('/home');
            break;
          }
          default: {
            console.log('Unhandled next step for signUp: ', signUpResponse.nextStep.signUpStep);
          }
        }

        await checkSession();
      } catch (error) {
        console.log('Something went wrong during signing up: ', error);
      } finally {
        setIsSigningIn(false);
      }
    },
    [navigate],
  );

  const [isConfirmSigningUp, setIsConfirmSigningUp] = useState(false);

  const handleConfirmSignUp = useCallback(
    async (email, confirmationCode) => {
      try {
        setIsSigningIn(true);

        const confirmSignUpResponse = await confirmSignUp({ username: email, confirmationCode });

        // debugger

        switch (confirmSignUpResponse.nextStep.signUpStep) {
          case 'CONFIRM_SIGN_UP' as unknown as ConfirmSignUpOutput['nextStep']['signUpStep']: {
            navigate('/confirm', { state: { email } });
            break;
          }
          case 'COMPLETE_AUTO_SIGN_IN' as unknown as ConfirmSignUpOutput['nextStep']['signUpStep']: {
            await autoSignIn();
            navigate('/home');
            break;
          }
          case 'DONE' as unknown as ConfirmSignUpOutput['nextStep']['signUpStep']: {
            navigate('/home');
            break;
          }
          default: {
            console.log('Unhandled next step for confirmSignUp: ', confirmSignUpResponse.nextStep.signUpStep);
          }
        }

        await checkSession();
      } catch (error) {
        console.log('Something went wrong during confirming sign up: ', error);
      } finally {
        setIsSigningIn(false);
      }
    },
    [navigate],
  );

  const [isResendConfirmationCode, setIsResendConfirmationCode] = useState(false);

  const handleResendConfirmationCode = useCallback(
    async (username: string) => {
      try {
        setIsResendConfirmationCode(true);

        const resendConfirmationCodeResponse = await resendConfirmationCode(username);
        console.log('resendConfirmationCode: ', resendConfirmationCode);
      } catch (error) {
        console.log('Something went wrong during resending confirmation code: ', error);
      } finally {
        setIsResendConfirmationCode(false);
      }
    },
    [navigate],
  );

  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = useCallback(async () => {
    try {
      setIsSigningOut(true);

      await signOut();
      await checkSession();

      navigate('/login');
    } catch (error) {
      console.log('Something went wrong during signing out: ', error);
    } finally {
      setIsSigningOut(false);
    }
  }, [navigate]);

  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handleResetPassword = useCallback(
    async (email: string) => {
      try {
        setIsResettingPassword(true);

        const resetPasswordResponse = await resetPassword({ username: email });

        debugger;

        switch (resetPasswordResponse.nextStep.resetPasswordStep) {
          case 'CONFIRM_RESET_PASSWORD_WITH_CODE' as unknown as ResetPasswordOutput['nextStep']['resetPasswordStep']: {
            navigate('/confirm-reset-password', { state: { email } });
            break;
          }
          case 'DONE' as unknown as ResetPasswordOutput['nextStep']['resetPasswordStep']: {
            navigate('/home');
            break;
          }
          default: {
            console.log('Unhandled next step for signUp: ', resetPasswordResponse.nextStep.resetPasswordStep);
          }
        }
      } catch (error) {
        console.log('Something went wrong during resetting password: ', error);
      } finally {
        setIsResettingPassword(false);
      }
    },
    [navigate],
  );

  const [isConfirmingResetPassword, setIsConfirmingResetPassword] = useState(false);

  const handleConfirmResetPassword = useCallback(
    async (email: string, confirmationCode: string, newPassword: string, confirmNewPassword: string) => {
      try {
        if (newPassword !== confirmNewPassword) {
          alert('Passwords do not match');
          return;
        }

        setIsConfirmingResetPassword(true);

        await confirmResetPassword({ username: email, confirmationCode, newPassword });

        debugger;

        navigate('/home', { state: { email } });
      } catch (error) {
        console.log('Something went wrong during confirming reset password: ', error);
      } finally {
        setIsConfirmingResetPassword(false);
      }
    },
    [navigate],
  );

  console.log('session: ', session);

  const authenticationState = useMemo<IAuthenticationContextState>(
    () => ({
      isAuthenticated: Boolean(session),
      isInitialized,

      accessToken: session?.tokens?.accessToken?.toString() || '',
      idToken: session?.tokens?.idToken?.toString() || '',

      signInDetails: {
        loginId: signInDetails?.loginId || '',
      },

      isSigningIn,
      handleSignIn,

      isChangingPassword,
      handleChangePassword,

      isSigningUp,
      handleSignUp,

      isConfirmSigningUp,
      handleConfirmSignUp,

      isSigningOut,
      handleSignOut,

      isResettingPassword,
      handleResetPassword,

      isConfirmingResetPassword,
      handleConfirmResetPassword,

      isResendConfirmationCode,
      handleResendConfirmationCode,
    }),
    [
      session,
      isInitialized,
      isSigningIn,
      handleSignIn,
      isChangingPassword,
      handleChangePassword,
      isSigningUp,
      handleSignUp,
      isConfirmSigningUp,
      handleConfirmSignUp,
      isSigningOut,
      handleSignOut,
      isResendConfirmationCode,
      handleResendConfirmationCode,
    ],
  );

  return <AuthenticationContext.Provider value={authenticationState}>{props.children}</AuthenticationContext.Provider>;
};

export const useAuthenticationContext = () => useContext<IAuthenticationContextState>(AuthenticationContext);

export default AuthenticationProvider;
