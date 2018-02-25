import React from 'react';
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { 
  getUserList,
  getCheckins, 
  getBusinessList,
} from '../../modules/action';
import CheckinScreen from './CheckinScreen';

const mapStateToProps = state => ({
  businessList: state.businessList,
  checkins: state.checkins,
  users: state.users,
})

const mapDispatchToProps = dispatch => {
  return {
    _getBusinessList: () => dispatch(getBusinessList()),
    _getCheckins: () => dispatch(getCheckins()),
    _getUserList: () => dispatch(getUserList()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckinScreen)