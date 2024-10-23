import { fetchAuthSession, signInWithRedirect, signIn, signOut } from 'aws-amplify/auth';

import { useAuthenticationContext } from '../AuthenticationProvider';


function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
      .join(""),
  );
  return JSON.parse(jsonPayload);
}

const HomePage = () => {
  const { isSigningOut, handleSignOut } = useAuthenticationContext();

  return (
    <div>
      <h1>Hello World</h1>
      
      <p>See console log for Amazon Cognito user tokens.</p>

      <button type="button" onClick={handleSignOut} disabled={isSigningOut}>
        Logout
      </button>
    </div>
  );
};

export default HomePage;
