import { useState } from "react";
import { useLocation } from "react-router-dom";

import { useAuthenticationContext } from '../AuthenticationProvider';

const ConfirmUserPage = () => {
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [confirmationCode, setConfirmationCode] = useState("");

  const { isConfirmSigningUp, handleConfirmSignUp } = useAuthenticationContext();

  const handleSubmit = e => {
    e.preventDefault();

    handleConfirmSignUp(email, confirmationCode)
  }

  return (
    <div className="loginForm">
      <h2>Confirm Account</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            className="inputText"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            disabled={isConfirmSigningUp}
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
            disabled={isConfirmSigningUp}
            required
          />
        </div>

        <button type="submit" disabled={isConfirmSigningUp}>Confirm Account</button>
      </form>
    </div>
  );
};

export default ConfirmUserPage;
