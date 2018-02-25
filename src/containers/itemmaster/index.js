import React from 'react';
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  removeItem,
  getItems,
  createItem,
  updateItem
} from '../../modules/action';
import ItemMasterScreen from './ItemMasterScreen';

const ItemMaster = (props) => (
  <div>
    <h3>ItemMaster</h3>
  </div>
)

const mapStateToProps = state => ({
  items: state.items,
})

const mapDispatchToProps = dispatch => {
  return {
    _getItems: () => dispatch(getItems()),
    _removeItem: (itemName) => dispatch(removeItem(itemName)),
    _createItem: (name, price, quantity) => dispatch(createItem(name, price, quantity)),
    _updateItem: (name, price, quantity) => dispatch(updateItem(name, price, quantity)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemMasterScreen)