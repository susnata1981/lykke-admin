import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import * as Types from './types';

const initialState = {
  user: {},
  users: {},
  businessList: {},
  routeList: {},
  status: {},
  notification: {},
  checkins: {},
  items: {},
}

const user = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case Types.LOGIN_SUCCESS:
      return {
        email: action.user.email
      }
    case Types.LOGOUT:
      return {
        email: undefined
      }
    default:
      return state;
  }
}

const users = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case Types.GET_USER_LIST:
      return action.users
    default:
      return state;
  }
}

const businessList = (state = initialState, action) => {
  switch (action.type) {
    case Types.BUSINESS_LIST_RECEIVED:
      return action.businessList;
    case Types.REMOVE_BUSINESS_SUCCESS:

    default:
      return state;
  }
}

const routeList = (state = initialState, action) => {
  switch (action.type) {
    case Types.ROUTE_LIST_RECEIVED:
    console.log(action);
      return action.routeList;
    default:
      return state;
  }
}

const status = (state = initialState, action) => {
  switch (action.type) {
    case Types.STATUS_PENDING:
      return {
        id: action.id,
        pending: true,
        success: false,
        errorMessage: action.errorMessage,
      };
    case Types.STATUS_COMPLETE:
      return {
        id: action.id,
        pending: false,
        success: action.success,
        errorMessage: undefined,
      };
    default:
      return state;
  }
}

const notification = (state = initialState, action) => {
  switch(action.type) {
    case Types.NOTIFICATION:
      return {
        id: action.id,
        success: action.success,
        message: action.message,
      }
    case Types.CLEAR_NOTIFICATION:
      return {
        id: undefined,
        success: undefined,
        message: undefined
      }
    default:
      return state;
  }
}

/* 
 * Item Master 
 */
const items = (state = initialState, action) => {
  switch(action.type) {
    case Types.GET_ITEM_MASTER:
      return action.items;
    default:
      return state;
  }
}

/* 
 * Checkin data. 
 */
const checkins = (state = initialState, action) => {
  switch(action.type) {
    case Types.CHECKINS_RECEIVED:
      return action.checkins;
    default:
      return state;
  }
}

export default combineReducers({
  user: user,
  users: users,
  businessList: businessList,
  routeList: routeList,
  items: items,
  checkins: checkins,
  status: status,
  notification: notification
});