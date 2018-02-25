import React from 'react';
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import UserListScreen from './UserListScreen';

import {
  createUser,
  removeUser,
  getUserList,
  getRouteList,
} from '../../modules/action'

const mapStateToProps = state => ({
  users: state.users,
  routeList: state.routeList,
})

const mapDispatchToProps = dispatch => {
  return {
    _getRouteList: () => dispatch(getRouteList()),
    _createUser: (firstname, lastname, email, role) => dispatch(createUser(firstname, lastname, email, role)),
    _removeUser: (userKey) => dispatch(removeUser(userKey)),
    _getUserList: () => dispatch(getUserList()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserListScreen);