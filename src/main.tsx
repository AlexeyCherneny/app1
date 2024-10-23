import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from 'aws-amplify';
import AuthenticationProvider from './AuthenticationProvider'
import { BrowserRouter } from "react-router-dom";

import amplifyConfig from './amplifyConfig.ts'

import App from "./App.tsx";

import "./index.css";

Amplify.configure(amplifyConfig)
const fn = async () => {
  const config = await Amplify.getConfig()
  console.log('Amplify: ', config)
}

fn()

const el = document.getElementById("root");

if (el) {
  ReactDOM.createRoot(el).render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthenticationProvider>
            <App />
        </AuthenticationProvider>
      </BrowserRouter>
    </React.StrictMode>,
  );
} else {
  throw new Error("Could not find root element.");
}
