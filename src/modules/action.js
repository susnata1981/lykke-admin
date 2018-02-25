import * as Types from './types';
import firebase from '../firebase'
import { get } from 'https';
import { validateEmail, isNumber, isInt, isFloat } from '../common/util';

let actionId = 0;
const NOTIFICAION_DURATION = 3000;

export const ADMIN_EMAIL = 'susnata@gmail.com';

export const loginSuccess = (user) => {
  return {
    type: Types.LOGIN_SUCCESS,
    user: user
  }
}

export const logoutSuccess = () => {
  return {
    type: Types.LOGOUT,
  }
}

const getId = () => {
  actionId = actionId + 1;
  return actionId;
}

const statusPending = (id) => {
  return {
    type: Types.STATUS_PENDING,
    id: id,
    showNotification: true,
  }
}

const statusComplete = (id, success, message = undefined) => {
  return {
    type: Types.STATUS_COMPLETE,
    showNotification: true,
    id: id,
    success: success,
    message: message,
  }
}

const businessListReceived = (id, businessList) => {
  return {
    type: Types.BUSINESS_LIST_RECEIVED,
    id: id,
    businessList: businessList,
    notification: {
      message: 'Business list retrieved',
      success: true
    }
  }
}

const routeListReceived = (id, routeList) => {
  console.log(`routeListReceivedAction = ${JSON.stringify(routeList)}`);
  return {
    type: Types.ROUTE_LIST_RECEIVED,
    id: id,
    routeList
  }
}

const removeBusinessSuccess = (businessName) => {
  return {
    type: Types.REMOVE_BUSINESS_SUCCESS,
    businessName: businessName,
    notification: {
      message: `${businessName} has been removed`,
      success: true,
    }
  }
}

const removeBusinessFailure = (businessName, errMsg) => {
  return {
    type: Types.REMOVE_BUSINESS_FAILURE,
    businessName: businessName,
    notification: {
      message: errMsg,
      success: false,
    }
  }
}


export const sendNotification = (id, success, message) => {
  return {
    type: Types.NOTIFICATION,
    id: id,
    success: success,
    message: message,
  }
}

export const clearNotification = (id) => {
  return {
    type: Types.CLEAR_NOTIFICATION,
    id: id
  }
}

export const getBusinessList = () => {
  return dispatch => {
    let actionId = getId();
    firebase.database().ref('businesses/').on('value', (snapshot) => {
      let result = {};
      console.log('received business list');
      snapshot.forEach(item => {
        result[item.key] = {
          name: item.key,
          address: item.val().address,
          lat: item.val().lat,
          lng: item.val().lng,
          outstandingBalance: item.val().outstandingBalance,
          timeCreated: item.val().time_created
        }
      });
      dispatch(businessListReceived(actionId, result));
    });
  }
}

export const createBusiness = (businessName, outstandingBalance, address, placeId, lat, lng) => {
  return dispatch => {
    let actionId = getId();
    firebase.database().ref('businesses/' + businessName).once('value', snapshot => {
      if (snapshot.exists()) {
        dispatch(statusComplete(actionId, false, `Business ${businessName} already exists`));
      } else {
        firebase.database().ref('businesses/' + businessName).set({
          address: address,
          outstandingBalance: outstandingBalance,
          placeId: placeId,
          lat: lat,
          lng: lng,
          timeCreated: new Date().getTime(),
        });
        dispatch(statusComplete(actionId, true, `Bussiness ${businessName} has been created`));
        dispatch(sendNotification(actionId, true, `Bussiness ${businessName} has been created`));
        setTimeout(() => {
          dispatch(clearNotification(actionId))
        }, 2000);
      }
    });
  }
}

export const updateOutstandingBalance = (businessName, outstandingBalance) => {
  return dispatch => {
    let actionId = getId();
    firebase.database().ref('businesses/' + businessName).update({
      outstandingBalance: outstandingBalance
    });
    dispatch(sendNotification(actionId, true, `Balance has been updated`));
  }
}

export const removeBusiness = (businessName) => {
  return dispatch => {
    let actionId = getId();
    dispatch(statusPending(actionId));
    firebase.database().ref('routes').once('value', snapshot => {
      snapshot.forEach(item => {
        if (item.val().businesses) {
          let existingBusiness = Object.keys(item.val().businesses).filter(key => key === businessName);
          if (existingBusiness.length > 0) {
            dispatch(removeBusinessFailure(businessName, `${businessName} is used in route`));
            // dispatch(statusComplete(actionId, false, `Route contains this business`));
            return;
          }
        }
      });
    });

    firebase.database().ref('businesses/' + businessName).remove();
    dispatch(removeBusinessSuccess(businessName));
    // dispatch(statusComplete(actionId, true, `Business has been removed`));
  }
}

export const login = () => {
  return dispatch => {
    console.log('login called');
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    provider.setCustomParameters({
      'login_hint': 'user@gmail.com'
    });

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(function () {
        console.log('persistence set to LOCAL');
        firebase.auth().signInWithPopup(provider).then(function (result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const token = result.credential.accessToken;
          // The signed-in user info.
          const user = result.user;
        }).catch(function (error) {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          const credential = error.credential;
          alert('Error login in ' + errorMessage);
        });
      }).catch(function (error) {
        console.log('failed to set persistence');
      });
  }
}

export const logout = () => {
  return dispatch => {
    firebase.auth().signOut().then(function () {
      dispatch(logoutSuccess());
    });
  }
}

export const createRoute = (routeName) => {
  return dispatch => {
    if (!routeName) {
      throw "Must provide a route name";
    }

    let actionId = getId();
    firebase.database().ref('routes/' + routeName).once('value', snapshot => {
      if (snapshot.exists()) {
        notify(actionId, false, `Route (${routeName}) already exists`);
        return;
      }

      firebase.database().ref('routes/' + routeName).set({
        timeCreated: new Date().getTime()
      });

      notify(dispatch, actionId, true, `Route (${routeName}) has been created`);
    })
  }
}

export const getRouteList = () => {
  return dispatch => {
    let actionId = getId();
    firebase.database().ref('routes/').on('value', (snapshot) => {
      let result = {};
      snapshot.forEach(item => {
        result[item.key] = {
          name: item.key,
          businesses: item.val().businesses,
          assignment: item.val().assignment,
          timeCreated: item.val().time_created,
        }
      });
      dispatch(routeListReceived(actionId, result));
    });
  }
}

export const updateRoute = (routeKey, assignee, dayOfWeek) => {
  return dispatch => {
    let actionId = getId();
    if (!assignee || !dayOfWeek) {
      notify(dispatch, actionId, false, `Route update failed. Must provide an assignee & assigned day`);
      return
    }
    let updates = {
      assignment: {
        'assignee': assignee,
        'dayOfWeek': dayOfWeek,
      }
    }
    firebase.database().ref('routes/' + routeKey).update(updates);
    notify(dispatch, actionId, true, `Route has been updated`);
  }
}

export const removeRoute = (routeKey) => {
  return dispatch => {
    let actionId = getId();
    firebase.database().ref('routes/' + routeKey).once('value', snapshot => {
      if (!snapshot.exists()) {
        dispatch(sendNotification(actionId, false, `Route (${routeKey}) does not exist`));
        return;
      }

      firebase.database().ref('routes/' + routeKey).remove();
      notify(dispatch, actionId, true, `Route (${routeKey}) has been removed`);
    })
  }
}

export const addBusinessToRoute = (businessKey, routeKey) => {
  return dispatch => {
    if (!routeKey) {
      throw 'Must have a valid route';
    }

    if (!businessKey) {
      throw 'Must provide a business name';
    }
    let actionId = getId();
    firebase.database().ref('routes/' + routeKey + '/businesses/' + businessKey).once('value', function (snapshot) {
      if (snapshot.exists()) {
        dispatch(sendNotification(actionId, false, `Business (${businessKey}) already exists to route`));
        return;
      }

      firebase.database().ref('routes/' + routeKey).once('value', function (snapshot) {
        let businesses = snapshot.val()['businesses'] || {};
        businesses[businessKey] = true;
        firebase.database().ref('routes/' + routeKey + '/businesses').update(businesses);
        dispatch(sendNotification(actionId, true, `Business (${businessKey}) added to route`));
      });
    });
  }
}

export const removeBusinessFromRoute = (businessKey, routeKey) => {
  return dispatch => {
    if (!routeKey) {
      throw 'Must have a valid route';
    }

    if (!businessKey) {
      throw 'Must provide a business name';
    }

    let actionId = getId();
    firebase.database().ref('routes/' + routeKey + '/businesses/' + businessKey).once('value', snapshot => {
      if (!snapshot.exists()) {
        dispatch(sendNotification(actionId, false, `Business (${businessKey}) does not exist in ${routeKey}`));
        return;
      }

      firebase.database().ref('routes/' + routeKey + '/businesses/' + businessKey).remove();
      notify(dispatch, actionId, true, `Business (${businessKey}) removed from ${routeKey}`);
    });
  }
}

const getUserListSuccess = (users) => {
  return {
    type: Types.GET_USER_LIST,
    users
  }
}

export const getUserList = () => {
  return dispatch => {
    let actionId = getId();
    firebase.database().ref('users').on('value', snapshot => {
      let users = {};
      snapshot.forEach(item => {
        users[item.key] = {
          key: item.key,
          email: item.val().email,
          firstname: item.val().firstname,
          lastname: item.val().lastname,
          role: item.val().role,
          timeCreated: item.val().time_created,
        }
      });
      dispatch(getUserListSuccess(users));
      notify(dispatch, actionId, true, `Retrieved user list`);
    })
  }
}

export const createUser = (firstname, lastname, email, role) => {
  return dispatch => {
    if (!firstname || !lastname || !email || !role) {
      notify(dispatch, actionId, false, `Incomplete information provided for creating user!`);
      throw 'Must provide all information for creating user';
    }

    if (!validateEmail(email)) {
      notify(dispatch, actionId, false, `Invalid email (${email}) provided for creating user!`);
      throw `Must provide valid email ${email}`;
    }


    let actionId = getId();
    firebase.database().ref('users').once('value', snapshot => {
      snapshot.forEach(item => {
        if (item.val() === email) {
          notify(dispatch, actionId, false, `User (${email}) already exist!`);
          return;
        }
      });

      firebase.database().ref('users/').push().set({
        firstname,
        lastname,
        email,
        role,
        timeCreated: new Date().getTime()
      });
      notify(dispatch, actionId, true, `User ${email} has been added.`);
    });
  }
}

export const removeUser = (userKey) => {
  return dispatch => {
    if (!userKey) {
      throw 'Must provide a valid user key';
    }

    let actionId = getId();
    firebase.database().ref('users/' + userKey).once('value', snapshot => {
      if (!snapshot.exists()) {
        notify(dispatch, actionId, false, `User (${userKey}) does not exist!`);
        return;
      }

      firebase.database().ref('users/' + userKey).remove();
      notify(dispatch, actionId, true, `User (${userKey}) removed.`);
    });
  }
}

const getItemMasterSuccess = (items) => {
  return {
    type: Types.GET_ITEM_MASTER,
    items
  }
}

export const getItems = () => {
  return dispatch => {
    let actionId = getId();
    firebase.database().ref('itemmaster').on('value', snapshot => {
      let items = {};
      snapshot.forEach(item => {
        items[item.key] = {
          key: item.key,
          name: item.key,
          price: item.val().price,
          quantity: item.val().quantity,
          timeCreated: item.val().time_created,
        }
      });
      dispatch(getItemMasterSuccess(items));
      notify(dispatch, actionId, true, `Retrieved user list`);
    })
  }
}

export const createItem = (itemName, price, quantity) => {
  return dispatch => {
    if (!itemName ) {
      notify(dispatch, actionId, false, `Invalid item name ${itemName}`);
      throw 'Must provide valid item name';
    }

    if (!isNumber(price) || !isNumber(quantity)) {
      notify(dispatch, actionId, false, `Invalid price ${price}|quantity ${quantity} provided for item!`);
      throw `Must provide valid number for price|quantity`;
    }


    let actionId = getId();
    firebase.database().ref('itemmaster').once('value', snapshot => {
      snapshot.forEach(item => {
        if (item.val() === itemName) {
          notify(dispatch, actionId, false, `Item (${itemName}) already exist!`);
          return;
        }
      });

      firebase.database().ref('itemmaster/' + itemName).set({
        price,
        quantity,
        timeCreated: new Date().getTime()
      });
      notify(dispatch, actionId, true, `Item ${itemName} has been created.`);
    });
  }
}

export const removeItem = (itemName) => {
  return dispatch => {
    if (!itemName) {
      throw 'Must provide a valid item name';
    }

    let actionId = getId();
    firebase.database().ref('itemmaster/' + itemName).once('value', snapshot => {
      if (!snapshot.exists()) {
        notify(dispatch, actionId, false, `Item (${itemName}) does not exist!`);
        return;
      }

      firebase.database().ref('itemmaster/' + itemName).remove();
      notify(dispatch, actionId, true, `Item (${itemName}) has been removed.`);
    });
  }
}

export const updateItem = (itemName, price, quantity) => {
  return dispatch => {
    if (!itemName) {
      throw 'Must provide a valid item name';
    }

    if (!isNumber(price) || !isInt(quantity)) {
      notify(dispatch, actionId, false, `Invalid price (${price}) | quantity (${quantity}) provided for item!`);
      throw `Must provide valid number for price|quantity`;
    }

    let actionId = getId();
    firebase.database().ref('itemmaster/' + itemName).once('value', snapshot => {
      if (!snapshot.exists()) {
        notify(dispatch, actionId, false, `Item (${itemName}) does not exist!`);
        return;
      }

      firebase.database().ref('itemmaster/' + itemName).update({
        price: price,
        quantity: quantity
      });
      notify(dispatch, actionId, true, `Item (${itemName}) has been updated.`);
    });
  }
}

export const checkinsReceived = (checkins) => {
  return {
    type: Types.CHECKINS_RECEIVED,
    checkins
  }
}

export const getCheckins = () => {
  return dispatch => {
    let actionId = getId();
    firebase.database()
      .ref('checkins')
      .orderByChild('timeCreated')
      .on('value', snapshot => {
      let checkins = {};
      snapshot.forEach(item => {
        checkins[item.key] = {
          key: item.key,
          businessKey : item.val().businessKey,
          order: item.val().order,
          payment: item.val().payment,
          status: item.val().status,
          timeCreated: item.val().timeCreated,
          timeCompleted: item.val().timeCompleted,
          userKey: item.val().userKey,
        }
      });
      dispatch(checkinsReceived(checkins));
    });
  }
}

const notify = (dispatch, id, retCode, message, autoClear = true) => {
  dispatch(sendNotification(actionId, retCode, message));
  if (autoClear) {
    setTimeout(() => {
      dispatch(clearNotification())
    }, NOTIFICAION_DURATION);
  }
}