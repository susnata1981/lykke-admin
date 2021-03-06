import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaterialIcon from 'react-google-material-icons'
import { confirmAlert } from 'react-confirm-alert';
import { fprice, isInt, isFloat, isNumber } from '../../common/util';
import {APP_CONFIG} from '../../config';

export default class ItemMasterEntry extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
  }

  state = {
    isEdit: false,
  }

  remove = () => {
    const item = this.props.item;

    confirmAlert({
      title: `Are you sure you want to delete item ${item.name}?`,
      message: 'Please confirm',
      confirmLabel: 'Confirm',
      cancelLabel: 'Cancel',
      onConfirm: () => this.props.removeItem(item.name),
    });
  }

  edit = () => {
    this.setState({
      isEdit: !this.state.isEdit
    });
  }

  save = () => {
    this.setState({
      isEdit: false
    });

    const item = this.props.item;
    let price = Number(this.priceInput.value);
    if (!isNumber(price)) {
      alert('Price must be a valid number');
      return;
    }

    let quantity = Number(this.quantityInput.value);
    if (!isInt(quantity)) {
      alert('Quantity must be a valid integer');
      return;
    }
    this.props.updateItem(item.name, price, quantity);
  }

  render() {
    const item = this.props.item;

    const hideOnEditClass = this.state.isEdit ? hide : show;
    const showOnEditClass = this.state.isEdit ? show : hide;

    return (
      <tr>
        <td className='w-15'>{item.name}</td>
        <td className='w-15'>
          <p style={hideOnEditClass}> {fprice(item.price)}</p>
          <input size='10' style={showOnEditClass} type='text' ref={el => this.priceInput = el} defaultValue={item.price} />
        </td>
        <td className='w-15'>
          <p> {fprice(item.price * APP_CONFIG.tax)}</p>
        </td>
        <td className='w-15'>
          <p> {fprice(item.price * (1 + APP_CONFIG.tax))}</p>
        </td>
        <td className='w-10'>
          <p style={hideOnEditClass}> {item.quantity}</p>
          <input size='10' style={showOnEditClass} type='text' ref={el => this.quantityInput = el} defaultValue={item.quantity} />
        </td>
        <td className='w-30'>
          <button class="btn btn-link" onClick={this.remove} disabled={this.state.isEdit}>
            <MaterialIcon icon="delete" size={24} />
          </button>
          <button class="btn btn-link" onClick={this.edit} style={hideOnEditClass}>
            <MaterialIcon icon="mode_edit" size={24} />
          </button>
          <button className='btn btn-link' style={showOnEditClass} onClick={this.save}>
            <MaterialIcon icon="save" size={24} />
          </button>
        </td>
      </tr>
    )
  }
};
const show = {
  display: 'inline'
}

const hide = {
  display: 'none',
}
