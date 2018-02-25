import React from 'react';
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { 
  createRoute,
  getRouteList, 
  getBusinessList,
  updateRoute,
  removeRoute,
  removeBusinessFromRoute,
  addBusinessToRoute,
  getUserList,
 } from '../../modules/action'
import RouteListScreen from './RouteListScreen';

const mapStateToProps = state => ({
  businessList: state.businessList,
  users: state.users,
  routeList: state.routeList,
});

const mapDispatchToProps = dispatch => {
  return {
    _createRoute: (routeName) => dispatch(createRoute(routeName)),
    _getRouteList: () => dispatch(getRouteList()),
    _getBusinessList: () => dispatch(getBusinessList()),
    _updateRoute: (routeKey, assignee, assignedDay) => dispatch(updateRoute(routeKey, assignee, assignedDay)),
    _removeRoute: (routeKey) => dispatch(removeRoute(routeKey)),
    _addBusinessToRoute: (businessKey, routeKey) => dispatch(addBusinessToRoute(businessKey, routeKey)),
    _removeBusinessFromRoute: (businessKey, routeKey) => dispatch(removeBusinessFromRoute(businessKey, routeKey)),
    _getUserList: () => dispatch(getUserList()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RouteListScreen)