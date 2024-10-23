import { useState } from "react";

import { useAuthenticationContext } from '../AuthenticationProvider';
import { useNavigate } from 'react-router-dom';

const SignInUpPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSignUp, setIsSignUp] = useState(false);
  

  const { isSigningIn, handleSignIn, isSigningUp, handleSignUp } = useAuthenticationContext();

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isSignUp) {
      handleSignUp(email, password, confirmPassword)
      return
    }

    handleSignIn(email, password)
  }

  return (
    <div className="loginForm">
      <h1>Welcome</h1>

      <h4>
        {isSignUp ? "Sign up to create an account" : "Sign in to your account"}
      </h4>
      
      <form onSubmit={handleSubmit}>
        <div>
          <input
            className="inputText"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            disabled={isSigningIn || isSigningUp}
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
            disabled={isSigningIn || isSigningUp}
            required
          />
        </div>

        {isSignUp && (
          <div>
            <input
              className="inputText"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              disabled={isSigningUp}
              required
            />
          </div>
        )}
        
        <button type="submit" disabled={isSigningIn || isSigningUp}>{isSignUp ? "Sign Up" : "Sign In"}</button>
      </form>

      {!isSignUp && <button type="button" onClick={() => navigate('/reset-password')}>Forgot password</button>}

      <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp
          ? "Already have an account? Sign In"
          : "Need an account? Sign Up"}
      </button>
    </div>
  );
};

export default SignInUpPage;
