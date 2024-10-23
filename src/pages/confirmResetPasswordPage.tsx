import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useAuthenticationContext } from '../AuthenticationProvider';

const SignInUpPage = () => {
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || '');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { isConfirmingResetPassword, handleConfirmResetPassword, isResendConfirmationCode, handleResendConfirmationCode } =
    useAuthenticationContext();

  const handleSubmit = (e) => {
    e.preventDefault();

    handleConfirmResetPassword(email, confirmationCode, password, confirmPassword);
  };

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
            placeholder="Email"
            disabled={isConfirmingResetPassword}
            required
          />
        </div>

        <div>
          <input
            className="inputText"
            type="text"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            placeholder="Confirmation Code"
            disabled={isConfirmingResetPassword}
            required
          />
        </div>

        <div>
          <input
            className="inputText"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={isConfirmingResetPassword}
            required
          />
        </div>

        <div>
          <input
            className="inputText"
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            disabled={isConfirmingResetPassword}
            required
          />
        </div>

        <button type="submit" disabled={isConfirmingResetPassword}>
          Submit
        </button>

        <button disabled={isResendConfirmationCode} onClick={() => handleResendConfirmationCode(email)}>
          Resend Code
        </button>
      </form>
    </div>
  );
};

export default SignInUpPage;
