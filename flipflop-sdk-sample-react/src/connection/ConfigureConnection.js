import modules from '../modules'
import { createStore } from 'redux';

export default function configureConnection() {
  return createStore(modules, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
}