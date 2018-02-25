import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import createHistory from 'history/createBrowserHistory'
import rootReducer from './modules/reducer.js'
import * as Types from './modules/types';
import { sendNotification, clearNotification } from './modules/action';

export const history = createHistory()

const initialState = {
  user: {},
  businessList: {},
  routeList: {},
  users: {},
  items: {},
  checkins: {},
}

const enhancers = []
const notifications = {};

const notificationMiddleware = store => next => action => {
  if (action.notification) {
    store.dispatch(sendNotification(action.id, action.notification.success, action.notification.message));
    setTimeout(() => {
      store.dispatch(clearNotification(action.id));
    }, action.notification.duration || 2000);
  }
  next(action);
}

const middleware = [
  thunk,
  routerMiddleware(history),
  logger,
  notificationMiddleware,
]

if (process.env.NODE_ENV === 'development') {
  const devToolsExtenson = window.devToolsExtension

  if (typeof devToolsExtenson === 'function') {
    enhancers.push(devToolsExtenson())
  }
}

const composeEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

export default createStore(
  rootReducer,
  initialState,
  composeEnhancers
)