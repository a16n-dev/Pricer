import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Store from './redux/store';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { ModalProvider } from './components/functionalModal/ModalProvider';

Amplify.configure(awsconfig);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={Store}>
      <SnackbarProvider maxSnack={3}>
        <ModalProvider>
          <App />
        </ModalProvider>
      </SnackbarProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
