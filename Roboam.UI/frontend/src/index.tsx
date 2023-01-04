import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MobXProviderContext, Provider } from "mobx-react";
import RootStore from "./stores/root-store";

export const ROOT_STORE = new RootStore();
export const ROOT_STORE_CONTEXT = MobXProviderContext as unknown as React.Context<{ rootStore: RootStore }>;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <Provider rootStore={ROOT_STORE}>
          <App />
      </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
