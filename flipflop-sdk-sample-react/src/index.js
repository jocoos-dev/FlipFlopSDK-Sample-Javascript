import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import configureConnection from './connection/ConfigureConnection'

const history = createBrowserHistory();
const store = configureConnection();

if (process.env.REACT_APP_STAGE === 'prod') {
  console.log = function() {};
}

ReactDOM.render(  
    <React.StrictMode>
      <Provider store={store} >
        <Router history={history}>
          <App />
        </Router>
      </Provider>
    </React.StrictMode>,
  
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
