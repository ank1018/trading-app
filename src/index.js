import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {GlobalStoreProvider} from "./store/GlobalStoreContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalStoreProvider>
      <App />
    </GlobalStoreProvider>
  </React.StrictMode>
);
