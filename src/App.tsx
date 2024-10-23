import { Routes, Route, Navigate } from 'react-router-dom';
import { useMemo } from 'react';


import { useAuthenticationContext } from './AuthenticationProvider';

import LoginPage from './pages/signInUpPage';
import HomePage from './pages/homePage';
import ConfirmUserPage from './pages/confirmUserPage';
import ChangePasswordPage from './pages/changePasswordPage';
import ResetPasswordPage from './pages/resetPasswordPage';
import ConfirmResetPasswordPage from './pages/confirmResetPasswordPage';
import './AuthenticationProvider/authService'
import './App.css';

const App = () => {
  const { isInitialized, isAuthenticated } = useAuthenticationContext();

  const baseNavigationRoute = useMemo(
    () => (isAuthenticated ? <Navigate replace to="/home" /> : <Navigate replace to="/login" />),
    [isAuthenticated],
  );

  if (!isInitialized) {
    return null
  }

  return (
    <Routes>
      <Route path="/" element={baseNavigationRoute} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/confirm" element={<ConfirmUserPage />} />

      <Route path="/home" element={<HomePage />} />

      <Route path="/change-password" element={<ChangePasswordPage />} />

      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route path="/confirm-reset-password" element={<ConfirmResetPasswordPage />} />
    </Routes>
  );
};

export default App;
