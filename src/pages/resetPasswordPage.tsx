import { useState } from "react";
import { useLocation } from "react-router-dom";

import { useAuthenticationContext } from '../AuthenticationProvider';

const SignInUpPage = () => {
  const [email, setEmail] = useState("");


  const { isResettingPassword, handleResetPassword } = useAuthenticationContext();

  const handleSubmit = (e) => {
    e.preventDefault()

    handleResetPassword(email)
  }

  return (
    <div className="loginForm">
      <h1>Reset Password</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            className="inputText"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={isResettingPassword}
            required
          />
        </div>

        <button type="submit" disabled={isResettingPassword}>Send Code</button>
      </form>
    </div>
  );
};

export default SignInUpPage;
