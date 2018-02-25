import React from 'react';
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import {
  getBusinessList,
  createBusiness, 
  removeBusiness, 
  updateOutstandingBalance
} from '../../modules/action';
import BusinessListScreen from './BusinessListScreen';

const mapStateToProps = state => ({
  businessList: state.businessList
});

const mapDispatchToProps = dispatch => {
  return {
    _createBusiness: (businessName, outstandingBalance, address, placeId, lat, lng) => dispatch(
      createBusiness(businessName, outstandingBalance, address, placeId, lat, lng)),
    _getBusinessList: () => dispatch(getBusinessList()),
    _removeBusiness: (businessName) => dispatch(removeBusiness(businessName)),
    _updateOutstandingBalance: (businessName, balance) => dispatch(updateOutstandingBalance(businessName, balance)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BusinessListScreen)