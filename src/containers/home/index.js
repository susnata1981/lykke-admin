import React from 'react';
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { 
  getCheckins, 
  getBusinessList,
  getItems 
} from '../../modules/action';
import HomeScreen from './HomeScreen';


const mapStateToProps = state => ({
  businessList: state.businessList,
  items: state.items,
  checkins: state.checkins,
})

const mapDispatchToProps = dispatch => {
  return {
    _getBusinessList: () => dispatch(getBusinessList()),
    _getCheckins: () => dispatch(getCheckins()),
    _getItems: () => dispatch(getItems()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen)