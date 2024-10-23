import { useState } from 'react';

import { useAuthenticationContext } from '../AuthenticationProvider';

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { isChangingPassword, handleChangePassword, isResendConfirmationCode, handleResendConfirmationCode } = useAuthenticationContext();

  const handleSubmit = (e) => {
    e.preventDefault();

    handleChangePassword(confirmPassword);
  };

  return (
    <div className="loginForm">
      <h1>Change Password</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            className="inputText"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={isChangingPassword}
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
            disabled={isChangingPassword}
            required
          />
        </div>

        <button type="submit" disabled={isChangingPassword}>
          Submit
        </button>

        <button disabled={isResendConfirmationCode} onClick={() => handleResendConfirmationCode('')}>
          Resend Code
        </button>
      </form>
    </div>
  );
};

export default UpdatePasswordPage;
