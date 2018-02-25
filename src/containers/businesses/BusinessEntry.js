import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isNumber } from '../../common/util';
import MaterialIcon from 'react-google-material-icons'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css' 

export default class BusinessEntry extends Component {
  static propTypes = {
    business: PropTypes.object.isRequired,
  }

  state = {
    isEditing: false
  }

  removeBusiness = () => {
    // confirm(`Are you sure you want to to delete ${business.name}?`);
    // this.props.removeBusiness(this.props.business.name);
    confirmAlert({
      title: 'Are you sure you want to delete?',
      message: 'Please confirm',
      confirmLabel: 'Confirm',
      cancelLabel: 'Cancel',
      onConfirm: () => this.props.removeBusiness(this.props.business.name),
    });
  }

  showOnMap = () => {
    const { business } = this.props;
    this.props.showOnMap(business.lat, business.lng, business.address, business.placeId);
  }

  edit = () => {
    this.setState({
      isEditing: true
    });
  }

  update = () => {
    this.setState({
      isEditing: false
    });

    const balance = this.outstandingBalanceInput.value;
    if (!isNumber(balance)) {
      alert('Must provide a number');
      return;
    }

    this.props.updateOutstandingBalance(this.props.business.name, balance);
  }

  render() {
    const { business } = this.props;
    const { isEditing } = this.state;
    const that = this;

    return (function () {
      if (!isEditing) {
        return (
          <tr className='m-0'>
            <td>{business.name}</td>
            <td>{business.address}</td>
            <td>{business.outstandingBalance}</td>

            <td>
              <button class="btn btn-link" onClick={that.removeBusiness}>
              <MaterialIcon icon="delete" size={24}/>
              </button>
              <button class="btn btn-link" onClick={that.showOnMap}>
              <MaterialIcon icon="place" size={24}/>
              </button>
              <button class="btn btn-link" onClick={that.edit}>
              <MaterialIcon icon="mode_edit" size={24}/>
              </button>
            </td>
          </tr>
        )
      } else {
        return (
          <tr>
            <td className='text-center'>{business.name}</td>
            <td className='text-center'>{business.address}</td>
            <td className='text-center'>
              <input ref={el => that.outstandingBalanceInput = el} type="text" name="outstandingBalance" defaultValue={business.outstandingBalance}></input>
            </td>
            <td className='text-center'>
              <button class="btn btn-link" onClick={that.removeBusiness} disabled>
              <MaterialIcon icon="delete" size={24}/>
              </button>
              <button class="btn btn-link" onClick={that.showOnMap} disabled>
              <MaterialIcon icon="place" size={24}/>
              </button>
              <button class="btn btn-link" onClick={that.update}>
              <MaterialIcon icon="save" size={24}/>
              </button>
            </td>
          </tr>
        )
      }
    }());
  }
}
