import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaterialIcon from 'react-google-material-icons'
import { confirmAlert } from 'react-confirm-alert';

export default class UserEntry extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  }

  remove = () => {
    const user = this.props.user;
    let name = user.firstname + ' ' + user.lastname;
    confirmAlert({
      title: `Are you sure you want to delete user ${name}?`,
      message: 'Please confirm',
      confirmLabel: 'Confirm',
      cancelLabel: 'Cancel',
      onConfirm: () => this.props.removeUser(user.key),
    });
  }

  render() {
    const user = this.props.user;

    return (
      <tr>
        <td className='w-10'>{user.firstname}</td>
        <td className='w-10'>{user.lastname}</td>
        <td className='w-20'>{user.email}</td>
        <td className='w-10'>{user.role}</td>
        <td className='w-10'>{
          this.props.assignedUsers[user.key] ? 'Yes' : 'No'
        }</td>
        <td className='w-40'>
          <button class="btn btn-link" onClick={this.remove}>
            <MaterialIcon icon="delete" size={24} />
          </button>
        </td>
      </tr>
    )
  }
};
